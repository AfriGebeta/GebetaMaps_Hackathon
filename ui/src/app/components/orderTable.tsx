import React, { useEffect, useState } from "react";
import {
  Table,
  TextInput,
  Select,
  MantineProvider,
  Pagination,
} from "@mantine/core";
import "@mantine/core/styles.css";
import Image from "next/image";
import { IoMdArchive } from "react-icons/io";

const OrderTable = () => {
  const [orders, setOrders] = React.useState<any[]>([]); // Ensure `orders` is an array
  const [loading, setLoading] = useState(true); // Loading state
  const [searchId, setSearchId] = useState(""); // Search input state
  const [filterStatus, setFilterStatus] = useState(""); // Status filter state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [ordersPerPage] = useState(5); // Items per page state
  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null; // Default value for SSR
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://liytapi.fenads.org/users/${userId}/orders`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtered orders based on search and filter inputs
  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order: any) => {
        const matchesId = order.id.toString().includes(searchId);
        const matchesStatus =
          filterStatus === "" || order.status.toLowerCase() === filterStatus;
        return matchesId && matchesStatus;
      })
    : [];

  // Pagination logic: get the orders to display for the current page
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Conditional styling for the status column
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { color: "orange", fontWeight: "bold" };
      case "delivered":
        return { color: "green", fontWeight: "bold" };
      case "in_progress":
        return { color: "blue", fontWeight: "bold" };
      default:
        return {};
    }
  };

  const rows = currentOrders.map((order: any) => (
    <Table.Tr key={order.id}>
      <Table.Td>{order.id}</Table.Td>
      <Table.Td>{order.customer_name}</Table.Td>
      <Table.Td>{order.origin}</Table.Td>
      <Table.Td>{order.destination}</Table.Td>
      <Table.Td>{order.price}</Table.Td>
      <Table.Td style={getStatusStyle(order.status)}>{order.status}</Table.Td>
    </Table.Tr>
  ));

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <>
      <MantineProvider>
        <div className="flex w-full justify-end gap-20 mb-10">
          <TextInput
            label="Search by ID"
            placeholder="Enter order ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Select
            label="Filter by Status"
            placeholder="Select status"
            data={[
              { value: "", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "delivered", label: "Delivered" },
              { value: "in_progress", label: "In Progress" },
            ]}
            value={filterStatus}
            onChange={(value) => setFilterStatus(value!)}
          />
        </div>
      </MantineProvider>
      {loading ? (
        <>
          <div className="flex justify-center items-center w-full h-screen bg-white">
            <Image
              className="pb-96"
              src="/img/liyt.gif"
              alt="Loading"
              width={100}
              height={100}
            />
          </div>
        </>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <>
              <div className="w-full flex justify-center items-center ">
                <p className="text-center text-xl text-gray-500 ml-5">
                  No Orders{" "}
                </p>
                <IoMdArchive className="text-gray-500 text-2xl ml-4" />
              </div>
            </>
          ) : (
            <MantineProvider>
              <div>
                <Table verticalSpacing="sm" withTableBorder striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Order Id</Table.Th>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Origin</Table.Th>
                      <Table.Th>Destination</Table.Th>
                      <Table.Th>Price</Table.Th>
                      <Table.Th>Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>

                {/* Pagination Component */}
                <div className="mt-4 flex justify-center">
                  <Pagination
                    value={currentPage} // Use 'value' instead of 'page'
                    onChange={setCurrentPage}
                    total={totalPages}
                    boundaries={1}
                    siblings={1}
                  />
                </div>
              </div>
            </MantineProvider>
          )}
        </>
      )}
    </>
  );
};

export default OrderTable;
