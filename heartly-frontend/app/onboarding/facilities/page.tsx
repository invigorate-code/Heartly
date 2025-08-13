"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
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
} from "@/app/onboarding/facilities/model";
import { redirect } from "next/navigation";
import { useUser } from "@/shared/context/UserContext";
import { facilityAPI, FacilityResponse } from "@/lib/api/facility";
import { toast } from "react-hot-toast";
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
  const { validateCurrentStep, completeCurrentStep, goToNextStep } = useOnboarding();

  useEffect(() => {
    const getUserAndFacilities = async () => {
      try {
        const response = await fetch('/api/getUserAndFacilities');
        const data = await response.json();

        if (!response.ok) {
          console.error('Error fetching user and facilities:', data.error);
          toast.error('Failed to load facilities');
          return;
        }

        setTenantId(data.tenantId);
        setOwner(data.owner);
        
        // Map backend facility format to component format
        const mappedFacilities: componentFacility[] = data.facilities.map((facility: FacilityResponse) => ({
          id: facility.id,
          name: facility.name,
          address: facility.address,
          city: facility.city,
          state: facility.state,
          zip: facility.zip,
          projected_client_count: facility.projected_client_count,
          room_count: facility.room_count,
          tenant_id: facility.tenant_id,
          phone: facility.phone,
          email: facility.email,
        }));
        
        setFacilitiesState(mappedFacilities);

      } catch (error) {
        console.error('Error calling API:', error);
        toast.error('Failed to load facilities');
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
    try {
      await facilityAPI.delete(facilityId);
      
      toast.success('Facility deleted successfully');
      setFacilitiesState(
        facilitiesState.filter((facility) => facility.id !== facilityId)
      );
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete facility');
    }
  };

  const handleSubmit = async (onClose: () => void) => {
    const validationErrors = validateFacility(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (isEditing) {
        // Update existing facility
        const updateData = {
          id: formData.id,
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          projectedClientCount: formData.projected_client_count || 0,
          roomCount: formData.room_count || 0,
          phone: formData.phone,
          email: formData.email,
        };

        const updatedFacility = await facilityAPI.update(updateData);
        
        toast.success('Facility updated successfully');
        
        // Update local state with the response
        const mappedFacility: componentFacility = {
          id: updatedFacility.id,
          name: updatedFacility.name,
          address: updatedFacility.address,
          city: updatedFacility.city,
          state: updatedFacility.state,
          zip: updatedFacility.zip,
          projected_client_count: updatedFacility.projected_client_count,
          room_count: updatedFacility.room_count,
          tenant_id: updatedFacility.tenant_id,
          phone: updatedFacility.phone,
          email: updatedFacility.email,
        };
        
        setFacilitiesState(
          facilitiesState.map((facility) =>
            facility.id === formData.id ? mappedFacility : facility
          )
        );
      } else {
        // Create new facility
        const createData = {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          projectedClientCount: formData.projected_client_count || 0,
          roomCount: formData.room_count || 0,
          tenantId: tenantId as string,
          phone: formData.phone,
          email: formData.email,
        };

        const newFacility = await facilityAPI.create(createData);
        
        toast.success('Facility created successfully');
        
        // Add to local state
        const mappedFacility: componentFacility = {
          id: newFacility.id,
          name: newFacility.name,
          address: newFacility.address,
          city: newFacility.city,
          state: newFacility.state,
          zip: newFacility.zip,
          projected_client_count: newFacility.projected_client_count,
          room_count: newFacility.room_count,
          tenant_id: newFacility.tenant_id,
          phone: newFacility.phone,
          email: newFacility.email,
        };
        
        setFacilitiesState([...facilitiesState, mappedFacility]);
      }

      setFormData({} as componentFacility);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting facility:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save facility');
    }
  };

  const completeFacilityOnboarding = async () => {
    try {
      // Validate current step before proceeding
      const validation = await validateCurrentStep();
      
      if (!validation.canProceed) {
        console.warn('Cannot proceed - validation failed:', validation.errors);
        alert('Please complete all required facility information before proceeding.');
        return;
      }

      // Complete current step and move to next
      const completed = await completeCurrentStep();
      
      if (completed) {
        console.log("Facility onboarding step completed successfully");
        await goToNextStep();
      } else {
        console.error('Failed to complete facility onboarding step');
        alert('Failed to save progress. Please try again.');
      }
    } catch (error) {
      console.error('Error completing facility onboarding:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full p-6 relative">
      {/* Onboarding Progress */}
      <OnboardingProgress />
      
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
                  <div className="flex flex-row gap-2">
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
                          projected_client_count: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <Input
                      isRequired
                      errorMessage="Please enter a valid room count"
                      label="Room Count"
                      labelPlacement="inside"
                      name="room_count"
                      type="number"
                      size="sm"
                      value={formData.room_count?.toString() || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          room_count: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-row gap-2">
                    <Input
                      label="Phone Number"
                      labelPlacement="inside"
                      name="phone"
                      type="tel"
                      size="sm"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                    <Input
                      label="Email Address"
                      labelPlacement="inside"
                      name="email"
                      type="email"
                      size="sm"
                      placeholder="facility@example.com"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex flex-row justify-between gap-2 w-full">
                <Button
                  onPress={() => {
                    onClose();
                    setIsEditing(false);
                    setFormData({} as componentFacility);
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
    </div>
  );
};

export default FacilitiesPage;