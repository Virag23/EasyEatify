const Data = {
    menu: [
        { id: 1, name: "Paneer Tikka", category: "Starters", price: 250, description: "Spiced paneer cubes grilled to perfection." },
        { id: 2, name: "Vegetable Spring Rolls", category: "Starters", price: 180, description: "Crispy rolls filled with mixed vegetables." },
        { id: 3, name: "Butter Paneer", category: "Main Course", price: 350, description: "Tender paneer cooked in a rich tomato butter gravy." },
        { id: 4, name: "Dal Makhani", category: "Main Course", price: 280, description: "Creamy black lentils slow-cooked with spices." },
        { id: 5, name: "Garlic Naan", category: "Breads", price: 60, description: "Soft indian bread topped with garlic and butter." },
        { id: 6, name: "Veg Biryani", category: "Rice", price: 220, description: "Aromatic basmati rice cooked with mixed vegetables." },
        { id: 7, name: "Gulab Jamun", category: "Dessert", price: 100, description: "Deep-fried dough balls soaked in sugar syrup." }
    ],

    tables: [
        { id: 1, number: "T1", capacity: 2, status: "Available", currentOrderId: null },
        { id: 2, number: "T2", capacity: 4, status: "Available", currentOrderId: null },
        { id: 3, number: "T3", capacity: 4, status: "Occupied", currentOrderId: 101 },
        { id: 4, number: "T4", capacity: 6, status: "Reserved", currentOrderId: null },
        { id: 5, number: "T5", capacity: 2, status: "Available", currentOrderId: null }
    ],

    users: [],

    orders: [
        {
            id: 101,
            tableId: 3,
            items: [
                { itemId: 3, quantity: 2, name: "Butter Paneer", price: 350 },
                { itemId: 5, quantity: 4, name: "Garlic Naan", price: 60 }
            ],
            status: "Served",
            totalAmount: 940,
            timestamp: new Date().toISOString()
        }
    ]
};

window.AppData = Data;
