"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import {
  Form,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useState } from "react";
import PencilIcon from "@/components/icons/Pencil";
import TrashIcon from "@/components/icons/TrashIcon";
import { validateFacility } from "@/app/onboarding/facilities/utils";
import {
  facilityTableColumns,
  componentFacility,
  FacilityWithoutId,
} from "@/app/onboarding/facilities/model";
import { redirect } from "next/navigation";
import { useUser } from "@/shared/context/UserContext";
const FacilitiesPage = () => {
  const [facilitiesState, setFacilitiesState] = useState<componentFacility[]>(
    []
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<componentFacility>(
    {} as componentFacility
  );
  const [owner, setOwner] = useState<{
    id: string;
    email: string;
    auth_id: string;
  } | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const getUserAndFacilities = async () => {
      try {
        const response = await fetch('/api/getUserAndFacilities');
        const data = await response.json();

        if (!response.ok) {
          console.error('Error fetching user and facilities:', data.error);
          return;
        }

        // For now, set empty data until API is properly implemented
        setTenantId(null);
        setOwner(null);
        setFacilitiesState([]);

      } catch (error) {
        console.error('Error calling API:', error);
      }
    };

    getUserAndFacilities();
  }, []);

  if (!owner) {
    return <div>Loading...</div>;
  }

  const handleEdit = (facilityId: string) => {
    setIsEditing(true);
    const facility = facilitiesState.find(
      (facility) => facility.id === facilityId
    );
    if (facility) {
      setFormData(facility);
    }
    onOpen();
  };

  const handleDelete = async (facilityId: string) => {
    // TODO: Implement facility deletion API call
    console.log("Deleting facility:", facilityId);

    setFacilitiesState(
      facilitiesState.filter((facility) => facility.id !== facilityId)
    );
  };

    if (isEditing) {
      // TODO: Implement facility update API call
      console.log("Updating facility:", formData);

      setFacilitiesState(
        facilitiesState.map((facility) =>
          facility.id === formData.id ? formData : facility
        )
      );
    } else {
      // TODO: Implement facility creation API call
      const newFacility = {
        ...formData,
        id: Date.now().toString(), // Temporary ID
        tenant_id: tenantId as string,
      };

      console.log("Creating facility:", newFacility);

      setFacilitiesState([...facilitiesState, newFacility]);
    }

    setFormData({} as componentFacility);
    setErrors({});
    onClose();
  };

  const completeFacilityOnboarding = async () => {
    // TODO: Implement user onboarding step update API call
    console.log("Completing facility onboarding for user:", owner?.id);

    redirect("/onboarding/staff-invite");
  };

  return (
    <div className="flex flex-col gap-4 w-full p-6 relative">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-medium">Facilities</h1>
        <Button color="primary" className="text-white" onPress={onOpen}>
          Add New Facility
        </Button>
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          {facilityTableColumns.map((column) => (
            <TableColumn align="center" key={column.key}>
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {facilitiesState.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.city}</TableCell>
              <TableCell>{row.state}</TableCell>
              <TableCell>{row.zip}</TableCell>
              <TableCell>{row.projected_client_count}</TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  color="primary"
                  variant="light"
                  size="sm"
                  onPress={() => handleEdit(row.id)}
                >
                  <PencilIcon />
                </Button>
                <Button
                  isIconOnly
                  color="warning"
                  variant="light"
                  size="sm"
                  onPress={() => handleDelete(row.id)}
                >
                  <TrashIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} size="lg" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Form
              onSubmit={(e) => e.preventDefault()}
              validationErrors={errors}
            >
              <ModalHeader>
                <h1 className="text-2xl font-medium">
                  {isEditing ? "Edit Facility" : "Add New Facility"}
                </h1>
              </ModalHeader>
              <ModalBody className="w-full">
                <div className="flex flex-col gap-3">
                  <Input
                    isRequired
                    errorMessage="Please enter a valid Facility Name"
                    label="Facility Name"
                    labelPlacement="inside"
                    name="facilityName"
                    type="text"
                    size="sm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <Input
                    isRequired
                    errorMessage="Please enter a valid address"
                    label="Address"
                    labelPlacement="inside"
                    name="address"
                    type="text"
                    size="sm"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                  <div className="flex flex-row gap-2">
                    <Input
                      isRequired
                      errorMessage="Please enter a valid city"
                      label="City"
                      labelPlacement="inside"
                      name="city"
                      type="text"
                      size="sm"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                    <Input
                      isRequired
                      errorMessage="Please enter a valid state"
                      label="State"
                      labelPlacement="inside"
                      name="state"
                      type="text"
                      size="sm"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                    <Input
                      isRequired
                      errorMessage="Please enter a valid zip code"
                      label="Zip Code"
                      labelPlacement="inside"
                      name="zip"
                      type="text"
                      size="sm"
                      value={formData.zip}
                      onChange={(e) =>
                        setFormData({ ...formData, zip: e.target.value })
                      }
                    />
                  </div>
                  <Input
                    isRequired
                    errorMessage="Please enter a valid amount of clients"
                    label="Amount of Clients"
                    labelPlacement="inside"
                    name="projected_client_count"
                    type="number"
                    size="sm"
                    value={formData.projected_client_count?.toString() || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projected_client_count: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter className="flex flex-row justify-between gap-2 w-full">
                <Button
                  onPress={() => {
                    onClose();
                    setIsEditing(false);
                    setFormData({} as Facility);
                  }}
                  type="reset"
                >
                  Cancel
                </Button>
                <Button
                  className="text-white"
                  color="primary"
                  type="submit"
                  onPress={(e) => handleSubmit(onClose)}
                >
                  Save
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
      <div className="fixed bottom-4 right-4">
        {
          // are there any facilities
          facilitiesState.length > 0 && (
            <Button
              className="text-white"
              color="primary"
              onPress={completeFacilityOnboarding}
            >
              Next Page
            </Button>
          )
        }
      </div>
    </div>
  );
};

export default FacilitiesPage;