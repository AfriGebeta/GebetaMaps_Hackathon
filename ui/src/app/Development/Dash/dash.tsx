import { motion } from "framer-motion";

const Dashboard = () => {
  const cards = [
    { title: "Transactions", data: "15 total" },
    { title: "Finance", data: "$5,320 total" },
    { title: "Users", data: "120 active" },
    { title: "Reports", data: "8 generated" },
  ];

  return (
    <div className="min-h-screen bg-white p-6 text-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl font-bold mb-6"
      >
        Dashboard
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-start justify-between h-32 hover:bg-gray-200 transition"
          >
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="text-2xl font-bold">{card.data}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
