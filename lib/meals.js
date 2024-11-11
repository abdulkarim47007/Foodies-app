import fs from "node:fs"; // Import the file system module from Node.js
import sql from "better-sqlite3"; // Import the better-sqlite3 module for SQLite database operations
import slugify from "slugify"; // Import the slugify module to create URL-friendly slugs
import xss from "xss"; // Import the xss module to sanitize input and prevent XSS attacks

// Initialize the SQLite database connection
const db = sql("meals.db");

// Function to get all meals from the database
export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay of 2 seconds
  // throw new Error('Loading Meals Failed'); // Uncomment to simulate an error
  return db.prepare("SELECT * FROM meals").all(); // Execute the SQL query to get all meals
}

// Function to get a specific meal by its slug
export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug); // Execute the SQL query to get the meal by slug
}

// Function to save a new meal to the database
export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true }); // Generate a URL-friendly slug from the meal title
  const instructions = xss(meal.instructions); // Sanitize the instructions to prevent XSS attacks

  // Get the file extension of the image
  const extension = meal.image.name.split(".").pop();
  // Create a filename using the slug and the file extension
  const filename = `${meal.slug}.${extension}`;
  // Create a write stream to save the image to the public/images directory
  const stream = fs.createWriteStream(`public/images/${filename}`);
  // Convert the image to a buffer
  const bufferedImage = await meal.image.arrayBuffer();
  // Write the buffered image to the file
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image Failed!"); // Throw an error if saving the image fails
    }
  });

  // Insert the meal data into the database
  db.prepare(
    "INSERT INTO meals (title, summary, instructions, image, creator, creator_email, slug) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    meal.title,
    meal.summary,
    instructions,
    filename,
    meal.creator,
    meal.creator_email,
    meal.slug
  );
}
