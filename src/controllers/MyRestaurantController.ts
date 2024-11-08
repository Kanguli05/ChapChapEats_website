import Restaurant from "../models/restaurant";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

const getMyRestaurant = async (req:Request, res:Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch (error) {
        console.log("error",error);
        res.status(500).json({message: "Error fetching restaurant"});
    }
}

const createMyRestaurant = async (req: Request, res: Response) => {
    try {
        //business logic of creating new restaurant for restaurant
        const existingRestaurant = await Restaurant.findOne({ user:req.userId });

        if (existingRestaurant) {
            return res.status(409).json({message:"Restaurant already exists"});
        }

       //creating business logic for imageUrl
       //const image = req.file as Express.Multer.File;
       //const base64Image = Buffer.from(image.buffer).toString('base64');
       //const dataURI = `data:${image.mimetype};base64,${base64Image}`;

       //const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

        /* Creating a restaurant based on the form data and uploading the 
        image to cloudinary. It links up the current logged in user to this 
        restaurant record and the save it in the database  */

        const imageUrl = await uploadImage(req.file as Express.Multer.File);


        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = imageUrl;
        restaurant.user = new mongoose.Types.ObjectId(req.userId);
        restaurant.lastUpdated = new Date();
        await restaurant.save();

        res.status(201).send(restaurant);
       

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error creating restaurant" });
    }
};

const updateMyRestaurant = async (req: Request, res: Response, next?: unknown) => {
    try {
        const restaurant = await Restaurant.findOne(
            {user: req.userId,}
        );

        if (!restaurant) {
            return res.status(404).json({message: "Restaurant not found"});
        }

        restaurant.restaurantName = req.body.restaurantName;
        restaurant.city = req.body.city;
        restaurant.country = req.body.country;
        restaurant.deliveryPrice = req.body.deliveryPrice;
        restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurant.cuisines = req.body.cuisines;
        restaurant.menuItems = req.body.menuItems;
        restaurant.lastUpdated = new Date();

        if(req.file) {
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }

        await restaurant.save();
        res.status(200).send(restaurant);

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Error updating restaurant" });
    }
};

const getMyRestaurantOrders = async (req: Request, res: Response, next?: unknown) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId });

        if(!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        };

        const orders = await Order.find({ restaurant: restaurant._id }).populate("restaurant").populate("user");

        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const updateOrderStatus = async (req: Request, res: Response, next?: unknown) => {
    try {
        const {orderId} = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);

        if(!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const restaurant = await Restaurant.findById(order.restaurant);

        if( restaurant?.user?._id.toString() !== req.userId) {
            return res.status(401).send();
        
        
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to update order status" });
    }
}
    
const uploadImage = async (file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString('base64');
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    return uploadResponse.url;
}


export default {
    createMyRestaurant,
    getMyRestaurant,
    updateMyRestaurant,
    getMyRestaurantOrders,
    updateOrderStatus,
};