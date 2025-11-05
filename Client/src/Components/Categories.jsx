import React from "react";

export default function Categories() {
  return (
    <div className="flex flex-col justify-center  items-center mt-12">
      {/* title  */}
      <h1 className="font-playfair-display-bold-italic">See our Latest </h1>
      <h1 className="font-playfair-display-bold-italic text-5xl">
        Shop by Categories{" "}
      </h1>
      {/* spices logo  */}
      <div className=" flex flex-wrap gap-4 mt-12">
        <div className=" flex flex-col items-center gap-2">
          <img
            src="https://i.pinimg.com/1200x/ca/8e/e7/ca8ee794d73a7438843ec224aafe4414.jpg"
            alt=""
            className="w-50 h-50 rounded-full"
          />
          <h1 className="font-playfair-display-bold-italic">local spices</h1>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img
            src="https://i.pinimg.com/1200x/e5/27/15/e527156003e6f61810ce8a19b3ea96e8.jpg"
            alt=""
            className="w-50 h-50 rounded-full"
          />
          <h1 className="font-playfair-display-bold-italic">local spices</h1>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img
            src="https://i.pinimg.com/1200x/e2/e1/de/e2e1def0a8caf9034d7de992067f1efe.jpg"
            alt=""
            className="w-50 h-50 rounded-full"
          />
          <h1 className="font-playfair-display-bold-italic">local spices</h1>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img
            src="https://i.pinimg.com/1200x/10/ca/56/10ca5609fbf45b00400d74fc2dbeb2c1.jpg"
            alt=""
            className="w-50 h-50 rounded-full"
          />
          <h1 className="font-playfair-display-bold-italic">local spices</h1>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img
            src="https://i.pinimg.com/1200x/36/5b/3d/365b3d604700046658dcd3341e9a7108.jpg"
            alt=""
            className="w-50 h-50 rounded-full"
          />
          <h1 className="font-playfair-display-bold-italic">local spices</h1>
        </div>
      </div>
      {/* spices logo  */}
      <div className=" mt-32 flex flex-wrap justify-center gap-14">
        {[
          {
            name: (
              <h1 className="font-playfair-display-italic tracking-tighter  text-xl">
                Natural mix
                <br />
                add to cart
              </h1>
            ),
            image:
              "https://i.pinimg.com/1200x/29/c1/23/29c123b447350a2df01f88b138a987d6.jpg",
            bgcolor: "#f7d9a6",
          },
          {
            name: (
              <h1 className="font-playfair-display-italic text-xl ">
                Tummeric mix
                <br />
                add to cart
              </h1>
            ),
            image: "https://i.pinimg.com/1200x/cb/af/b1/cbafb19663f02a76e2dedd0a2d383805.jpg",
            bgcolor: "#d1f7c6",
          },
          {
            name: (
              <h1 className="font-playfair-display-italic text-xl">
                Senamon powder
                <br />
                add to cart
              </h1>
            ),
            image: "https://i.pinimg.com/1200x/05/1e/97/051e97d25d621254c90893e9752bb8ee.jpg",
            bgcolor: "#fce3f5",
          },
        ].map(
          (
            item,
            index // Fixed: (item, index) — item is now the object
          ) => (
            <div
              key={index}
              className=" rounded-lg h-[40vh] w-[25vw]  flex flex-col  justify-center items-center " // Tailwind for layout; add width if needed (e.g., w-64)
              style={{ backgroundColor: item.bgcolor }}
            >
              <div className=" flex  justify-centery  items-center gap-7  mt-5">
                <div>
                  {item.name}
                </div>
                <img src={item.image} alt="" className="w-40 h-40" />
                
              </div>
               <div className="mt-6">
                 <button className="bg-black text-white px-7 py-2 rounded-lg  cursor-pointer">shop now</button>
               </div>
              {/* If you add images later: <img src={item.image} alt="" className="w-20 h-20" /> */}
            </div>
          )
        )}
      </div>

      <div className="mt-24">
         <h1 className="font-playfair-display-bold-italic text-center">See our Latest </h1>
      <h1 className="font-playfair-display-bold-italic text-5xl">
        Orginic Product
      </h1>
      </div>
    </div>
  );
}
