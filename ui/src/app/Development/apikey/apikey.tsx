"use client";
import React, { useEffect, useState } from "react";
import { Button, Group, Table } from "@mantine/core";
import "@mantine/core/styles.css";
import {
  MdContentCopy,
  MdDeleteOutline,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { motion } from "framer-motion";
import Image from "next/image";
const Apikey = () => {
  const [apiKeyData, setApiKeyData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle visibility for the specific key
    }));
  };
  const [userToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null; // Default value for SSR
  });

  const createApiKey = async () => {
    try {
      const response = await fetch("https://liytapi.fenads.org/api_keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ api_key: { name: "" } }),
      });

      if (!response.ok) {
        throw new Error("Failed to create key");
      } else {
        console.log({ userToken });
        feachkey();
      }
    } catch (error) {
      console.error("Error creating key:", error);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const response = await fetch(
        `https://liytapi.fenads.org/api_keys/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${userToken}`, // Ensure `userToken` is available
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete API key");
      }
      feachkey();
    } catch (error) {
      console.error("Error deleting API key:", error);
      alert("Failed to delete API key.");
    }
  };

  const feachkey = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://liytapi.fenads.org/api_keys", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setApiKeyData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    feachkey();
  }, []);

  const row = apiKeyData.map((item: any) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        {visibleKeys[item.id] ? (
          <p className="text-xl">{item.key}</p>
        ) : (
          <p className="text-2xl">*************</p>
        )}
      </Table.Td>
      <Table.Td>
        {
          <Group justify="end">
            <button
              onClick={() => {
                navigator.clipboard
                  .writeText(item.key)
                  .then(() => {
                    alert("API Key copied to clipboard!");
                  })
                  .catch((err) => {
                    console.error("Failed to copy text: ", err);
                  });
              }}
            >
              <MdContentCopy />
            </button>
            <button onClick={() => toggleVisibility(item.id)}>
              <MdOutlineRemoveRedEye />
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this API key?")) {
                  deleteApiKey(item.id);
                }
              }}
            >
              <MdDeleteOutline />
            </button>
          </Group>
        }
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full flex items-center justify-between p-10"
      >
        <p>Api Key</p>
        <Button
          onClick={createApiKey}
          variant="filled"
          color="grape"
          size="md"
          radius="md"
        >
          Create Key
        </Button>
      </motion.div>
      <div className="w-full">
        <div>
          {loading ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="flex justify-center items-center w-fullbg-white"
              >
                <Image
                  className="pb-96"
                  src="/img/liyt.gif"
                  alt="Loading"
                  width={100}
                  height={100}
                />
              </motion.div>
            </>
          ) : apiKeyData.length === 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="w-full flex justify-center"
              >
                <p className="text-center text-gray-500">No Api Key created </p>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Table verticalSpacing="sm" horizontalSpacing="xl">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Api Key</Table.Th>
                    <Table.Th>
                      <Group justify="end"> Actions</Group>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{row}</Table.Tbody>
              </Table>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Apikey;
