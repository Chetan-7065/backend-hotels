const {initializeDatabase} = require("./db/db.connect")
const Hotels = require("./models/hotels.models")
require("dotenv").config()
const express = require("express")
const app = express()
app.use(express.json())
initializeDatabase()
const cors = require("cors"); 
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

async function createHotels(newHotel){
  try{
    const hotel = new Hotels(newHotel)
    const saveHotel = await hotel.save()
    return(saveHotel)
  }catch(error){
    throw error
  }
}

app.post("/hotels" , async (req, res) => {
  try{
    const savedHotel = await createHotels(req.body)
    res.status(201).json({message: "Hotel added successfully", hotel : savedHotel})
  }catch(error){
    res.status(500).json({error: "Failed to add hotel."})
  }
})

async function readAllHotels(){
  try{
    const hotels = await Hotels.find()
    return(hotels)
  }catch(error){
    throw error
  }
}

app.get("/", (req, res) => {
  res.send("Hello, express server")
})

app.get("/hotels", async (req, res) => {
 try{
  const hotels = await readAllHotels()
  if(hotels.length != 0){
    res.json(hotels)
  }else{
    res.status(400).json({error: "No hotels found."})
  }
 }catch(error){
   res.status(500).json({error: "Failed to fetch hotels."})
 }
})

async function readHotelsByName(hotelName){
  try{
    const hotelByName = await Hotels.findOne({name: hotelName})
    return(hotelByName)
  }catch(error){
    throw error
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try{
    const hotel = await readHotelsByName(req.params.hotelName)
    if(hotel){
      res.json(hotel)
    }else{
      res.status(404).json({error: "No hotel found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to fetch hotels"})
  }
})

async function readHotelsByPhoneNumber(hotelPhoneNumber){
  try{
    const hotelsByPhoneNumber = await Hotels.find({phoneNumber: hotelPhoneNumber})
    return(hotelsByPhoneNumber)
  }catch(error){
    throw error
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try{
    const hotels = await readHotelsByPhoneNumber(req.params.phoneNumber)
    if(hotels.length != 0){
      res.json(hotels)
    }else{
      res.status(404).json("No hotels found.")
    }
  }catch(error){
    res.status(500).json({error: "Failed to fetch hotels."})
  }
})

async function readHotelsByRating (hotelRating){
  try{
    const hotelsByRating = await Hotels.find({rating: hotelRating })
    return(hotelsByRating)
  }catch(error){
    throw error
  }
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try{
    const hotels = await readHotelsByRating(req.params.hotelRating)
    if(hotels.length != 0){
      res.json(hotels)
    }else{
      res.status(404).json({error: "No hotels found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to fetch hotels."})
  }
})

async function readHotelsByCategory(hotelCategory){
  try{
    const hotelsByCategory = await Hotels.find({category: hotelCategory}) 
    return(hotelsByCategory)
  }catch(error){
    throw error
  }
}

app.get("/hotels/category/:hotelCategory" , async (req, res) => {
  try{
    const hotels = await readHotelsByCategory(req.params.hotelCategory)
    if(hotels.length != 0){
      res.json(hotels)
    }else{
      res.status(404).json({error: "No hotels found."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to fetch hotels."})
  }
})

async function deleteHotelsById(hotelId){
  try{
    const deleteMovie = await Hotels.findByIdAndDelete(hotelId)
    return(deleteMovie)
  }catch(error){
    throw error
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try{
    const deletedHotel = await deleteHotelsById(req.params.hotelId)
    if(deletedHotel){
      res.status(201).json({message: "Hotel deleted successfully."})
    }
  }catch(error){
    res.status(500).json({error: "Failed to delete hotel."})
  }
})

async function updateHotelById(hotelId , dataToUpdate){
  try{
    const updateHotel = await Hotels.findByIdAndUpdate(hotelId, dataToUpdate, {new: true})
    return(updateHotel)
  }catch(error){
    throw error
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try{
    const updatedHotel = await updateHotelById(req.params.hotelId, req.body)
    if(updatedHotel){
      res.status(200).json({message: "Hotel updated successfully.", hotel: updatedHotel})
    }
  }catch(error){
    res.status(500).json({error: "Failed to update hotel."})
  }
})



const PORT = process.env.PORT || 3000

app.listen(PORT , () => {
  console.log(`Server is running on port ${PORT}`)
})
