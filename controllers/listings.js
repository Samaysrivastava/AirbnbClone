const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken:mapToken});

// index
module.exports.index = async(req,res)=>{
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};
// new listing
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};


// show listing
module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await  Listing.findById(id)
      .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
        }).populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};


module.exports.createListing= async(req,res)=>{
    let response = await geocodingClient.forwardGeocode({
        query:req.body.listings.location,
        limit:1
    })
      .send();
    
    // res.send("done");

    let url  = req.file.path;
    let filename = req.file.filename;

    // console.log(url,"..",filename);
    const newListing = new Listing(req.body.listings);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedlisting = await newListing.save();
    console.log(savedlisting);
    req.flash("success","new listing created");
    res.redirect("/listings");
};
// render edit form
module.exports.renderEdit=async(req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

// update listing post route

module.exports.updateListing=async(req,res)=>{
    let {id} = req.params;
    let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listings});
    if(typeof req.file!=="undefined"){
        let url  = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();

    }
  
    req.flash("success","listing updated!");
    res.redirect(`/listings/${id}`);

};

// delete
module.exports.destroyListing=async (req,res)=>{
    let{id} = req.params;
    let deleatedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","successfully deleated listing");
    res.redirect("/listings");
};