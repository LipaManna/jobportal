"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateEmployerSettings } from "@/features/server/employer.actions";
import { Building2, Calendar, FileText, Globe, MapPin, Replace, Trash } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  EmployerProfileData,
  employerProfilSchema,
  org_types_schema,
  team_size_schema,
} from "../employers.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from 'next/image';

const EmployerSettingsForm = ({
  initialData,
}: {
  initialData?: Partial<EmployerProfileData>;
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EmployerProfileData>({
    resolver: zodResolver(employerProfilSchema),
    defaultValues: initialData,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.image && typeof initialData.image === "string"
      ? initialData.image
      : null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageError = errors.image as { message?: string } | undefined;

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "jobportalusers");

    const response = await fetch("/api/fileupload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result?.res?.secure_url) {
      throw new Error(result?.msg || "Cloudinary upload failed");
    }

    return result.res.secure_url as string;
  };

  const handleFormSubmit = async (data: EmployerProfileData) => {
    try {
      let imageUrl = undefined;

      if (data.image && typeof data.image !== "string") {
        imageUrl = await uploadImageToCloudinary(data.image);
      } else if (typeof data.image === "string") {
        imageUrl = data.image;
      }

      const payload: EmployerProfileData = {
        ...data,
        image: imageUrl || "",
      };

      const response = await updateEmployerSettings(payload);
      if (response && "error" in response) {
        toast.error(response.error as string);
        return;
      }
      if (response) {
        toast.success("Profile updated successfully");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update employer settings";
      console.log(error);
      toast.error(message);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true, shouldTouch: true });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setValue("image", "", { shouldValidate: true, shouldTouch: true });
    setPreviewUrl(null);
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };
  return (
    <Card className="w-3/4">
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Field className="grid w-full  items-center gap-3">
            <FieldLabel htmlFor="input-field-image">Upload Image</FieldLabel>
            <Controller
              name="image"
              control={control}
              rules={{ required: "Please select an image file." }}
              render={({ field }) => (
                <div>
                  {!previewUrl ? (
                    <input
                      id="input-field-image"
                      type="file"
                      accept="image/*"
                      className="border p-2 w-full rounded"
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        field.onChange(file);
                        handleImageChange(event);
                      }}
                    />
                  ) : (
                    <div className="mt-2 flex items-start gap-3">
                      <div className="overflow-hidden rounded-lg border">
                        <Image
                          src={previewUrl}
                          alt="Logo preview"
                          width={128}
                          height={128}
                          className="object-fit"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={handleChangeImage}
                        >
                          <Replace/>
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteImage}
                        >
                          <Trash/>
                        </Button>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      field.onChange(file);
                      handleImageChange(event);
                    }}
                  />
                </div>
              )}
            />
            {imageError?.message && (
              <p className="text-red-500 text-sm mt-1">{imageError.message}</p>
            )}
          </Field>
          <Field className="grid w-full  items-center gap-3">
            <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
            <Input
              id="input-field-username"
              type="text"
              placeholder="Enter your username"
              {...register("username")}
              className={`border-slate-200 focus:ring-primary/20 ${errors.username ? "border-destructive" : ""}`}
            />
            {errors.username && (
              <p className="text-red-800 text-sm">{errors.username.message}</p>
            )}
          </Field>
          <Field className="grid w-full  items-center gap-3">
            <FieldLabel htmlFor="input-field-email">Email</FieldLabel>
            <Input
              id="input-field-email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`border-slate-200 focus:ring-primary/20 ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-red-800 text-sm">{errors.email.message}</p>
            )}
          </Field>
          <Field className="grid w-full items-center gap-3">
            <FieldLabel htmlFor="input-field-name">Company Name *</FieldLabel>
            <div className="relative">
              <Building2
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                size={18}
              />
              <Input
                id="input-field-name"
                type="text"
                placeholder="Enter your company name"
                {...register("name")}
                className={`pl-10  border-slate-200 focus:ring-primary/20 ${errors.name ? "border-destructive" : ""}`}
              />
            </div>
            {errors.name && (
              <p className="text-red-800 text-sm">{errors.name.message}</p>
            )}
          </Field>
          <Field className="grid w-full items-center gap-3">
            <FieldLabel htmlFor="input-field-companydescription">
              Description *
            </FieldLabel>
            <div className="relative">
              <FileText
                className="absolute left-3 top-4.5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                size={18}
              />
              <Textarea
                id="input-field-companydescription"
                placeholder="Enter your company description"
                {...register("description")}
                className={`pl-10  border-slate-200 focus:ring-primary/20 ${errors.description ? "border-destructive" : ""}`}
              />
              {/* <Tiptap />   */}
            </div>
            {errors.description && (
              <p className="text-red-800 text-sm">
                {errors.description.message}
              </p>
            )}
          </Field>
          <div className="flex gap-4">
            <Field className="grid w-full items-center gap-3">
              <FieldLabel htmlFor="input-field-yearofestablishment">
                Year of Establishment *
              </FieldLabel>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <Input
                  id="input-field-yearofestablishment"
                  type="text"
                  placeholder="Enter your year of establishment"
                  {...register("yearOfEstablishment")}
                  className={`pl-10  border-slate-200 focus:ring-primary/20 ${errors.yearOfEstablishment ? "border-destructive" : ""}`}
                  maxLength={4}
                />
              </div>
              {errors.yearOfEstablishment && (
                <p className="text-red-800 text-sm">
                  {errors.yearOfEstablishment.message}
                </p>
              )}
            </Field>
            <Field className="grid w-full items-center gap-3">
              <FieldLabel htmlFor="input-field-location">
                Location (Optional)
              </FieldLabel>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <Input
                  id="input-field-location"
                  type="text"
                  placeholder="Enter your location"
                  {...register("location")}
                  className="pl-10  border-slate-200 focus:ring-primary/20"
                />
              </div>
              {errors.location && (
                <p className="text-red-800 text-sm">
                  {errors.location.message}
                </p>
              )}
            </Field>
          </div>
          <Field className="grid w-full items-center gap-3">
            <FieldLabel htmlFor="input-field-websiteurl">
              Website URL (Optional)
            </FieldLabel>
            <div className="relative">
              <Globe
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                size={18}
              />
              <Input
                id="input-field-websiteurl"
                type="text"
                placeholder="Enter your website url"
                {...register("websiteUrl")}
                className="pl-10  border-slate-200 focus:ring-primary/20"
              />
            </div>
            {errors.websiteUrl && (
              <p className="text-red-800 text-sm">
                {errors.websiteUrl.message}
              </p>
            )}
          </Field>
          <div className="flex gap-4">
            <div className="w-full ">
              <FieldLabel htmlFor="input-field-org_type" className="mb-3">
                Organization Type *
              </FieldLabel>
              <Controller
                name="orgType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    {/* <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10" size={18} /> */}
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={`w-full ${errors.orgType ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {org_types_schema.options.map((org_type) => (
                          <SelectItem key={org_type} value={org_type}>
                            {org_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.orgType && (
                      <p className="text-red-800 text-sm mt-1">
                        {errors.orgType.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="w-full">
              <FieldLabel htmlFor="input-field-team_size" className="mb-3">
                Team Size *
              </FieldLabel>
              <Controller
                name="teamSize"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={`w-full ${errors.teamSize ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        {team_size_schema.options.map((team_size) => (
                          <SelectItem key={team_size} value={team_size}>
                            {team_size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.teamSize && (
                      <p className="text-red-800 text-sm mt-1">
                        {errors.teamSize.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          {
            isDirty && (
              <p className="text-sm text-muted-foreground mt-1">
                You have unsaved changes
              </p>
            )
          }
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployerSettingsForm;
