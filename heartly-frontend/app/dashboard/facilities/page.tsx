"use client";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@heroui/react";
import { PlusIcon } from "lucide-react";
import React from "react";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const columns = [
  { name: "Facility Name", uid: "name" },
  { name: "LOCATION", uid: "location" },
  { name: "ACTIONS", uid: "actions" },
];

const facilities = [
  {
    id: 1,
    name: "Heartly Care",
    location: "San Francisco, CA",
    status: "active",
  },
  {
    id: 2,
    name: "Heartly Care",
    location: "San Francisco, CA",
    status: "paused",
  },
  {
    id: 3,
    name: "Heartly Care",
    location: "San Francisco, CA",
    status: "vacation",
  },
  {
    id: 4,
    name: "Heartly Care",
    location: "San Francisco, CA",
    status: "active",
  },
  {
    id: 5,
    name: "Heartly Care",
    location: "San Francisco, CA",
    status: "active",
  },
]

const DashboardFacilites = () => {
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {user.team}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <main className="flex w-full flex-col items-center">
      <div className="w-full">
        <header className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Facilities</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your facilities here</p>
          </div>
          <Button className="w-full sm:w-auto">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Facility
          </Button>
        </header>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <Table aria-label="Facilities table">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  className="bg-gray-50 p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={facilities}>
              {(item) => (
                <TableRow key={item.id} className="border-b border-gray-200 bg-white">
                  {(columnKey) => (
                    <TableCell className="whitespace-nowrap p-4 text-sm text-gray-900">
                      {renderCell(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  </div>
  );
};

export default DashboardFacilites;
