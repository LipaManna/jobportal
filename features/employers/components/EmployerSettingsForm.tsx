"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateEmployerSettings } from "@/features/server/employer.actions"
import { IFormInput, org_types_array, team_size_array } from "@/models/models.interface"
import { Briefcase, Building2, Calendar, FileText, Globe, MapPin } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"


const EmployerSettingsForm = () => {
    const { register, handleSubmit, control } = useForm<IFormInput>()
    const handleFormSubmit =async (data: IFormInput) => {
        console.log(data)
        try {
            const response = await updateEmployerSettings(data);
        if(response){
            toast.success("Profile updated successfully");
        }
        }
        catch(error){
            console.log(error)
            toast.error("Failed to update employer settings")
        }
    }
    return (
        <Card className="w-3/4">
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <Field className="grid w-full  items-center gap-3">
                        <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
                        <Input
                            id="input-field-username"
                            type="text"
                            placeholder="Enter your username"
                            {...register("username")}
                        />
                    </Field>
                    <Field className="grid w-full  items-center gap-3">
                        <FieldLabel htmlFor="input-field-email">Email</FieldLabel>
                        <Input
                            id="input-field-email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email")}
                        />
                    </Field>
                    <Field className="grid w-full items-center gap-3">
                        <FieldLabel htmlFor="input-field-companyname">Company Name *</FieldLabel>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <Input
                                id="input-field-companyname"
                                type="text"
                                placeholder="Enter your company name"
                                {...register("companyname")}
                                className="pl-10  border-slate-200 focus:ring-primary/20"
                            />
                        </div>
                    </Field>
                    <Field className="grid w-full items-center gap-3">
                        <FieldLabel htmlFor="input-field-companydescription">Description *</FieldLabel>
                        <div className="relative">
                            <FileText className="absolute left-3 top-4.5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <Textarea
                                id="input-field-companydescription"
                                placeholder="Enter your company description"
                                {...register("companydescription")}
                                className="pl-10  border-slate-200 focus:ring-primary/20"
                            />
                        </div>
                    </Field>
                    <div className="flex gap-4">
                        <Field className="grid w-full items-center gap-3">
                            <FieldLabel htmlFor="input-field-yearofestablishment">Year of Establishment *</FieldLabel>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    id="input-field-yearofestablishment"
                                    type="text"
                                    placeholder="Enter your year of establishment"
                                    {...register("yearofestablishment")}
                                    className="pl-10  border-slate-200 focus:ring-primary/20"
                                    maxLength={4}
                                />
                            </div>
                        </Field>
                        <Field className="grid w-full items-center gap-3">
                            <FieldLabel htmlFor="input-field-location">Location (Optional)</FieldLabel>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <Input
                                    id="input-field-location"
                                    type="text"
                                    placeholder="Enter your location"
                                    {...register("location")}
                                    className="pl-10  border-slate-200 focus:ring-primary/20"
                                />
                            </div>
                        </Field>
                    </div>
                    <Field className="grid w-full items-center gap-3">
                        <FieldLabel htmlFor="input-field-websiteurl">Website URL (Optional)</FieldLabel>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <Input
                                id="input-field-websiteurl"
                                type="text"
                                placeholder="Enter your website url"
                                {...register("websiteurl")}
                                className="pl-10  border-slate-200 focus:ring-primary/20"
                            />
                        </div>
                    </Field>
                    <div className="flex gap-4">
                        <div className="w-full ">
                            <FieldLabel htmlFor="input-field-org_type" className="mb-3">Organization Type *</FieldLabel>
                            <Controller
                                name="org_type"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative">
                                        {/* <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10" size={18} /> */}
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select organization type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {org_types_array.map((org_type) => (
                                                    <SelectItem key={org_type} value={org_type}>
                                                        {org_type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )} />
                        </div>
                        <div className="w-full">
                            <FieldLabel htmlFor="input-field-team_size" className="mb-3">Team Size *</FieldLabel>
                            <Controller
                                name="team_size"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative">
                                        {/* <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10" size={18} /> */}
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select team size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {team_size_array.map((team_size) => (
                                                    <SelectItem key={team_size} value={team_size}>
                                                        {team_size}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )} />
                        </div>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default EmployerSettingsForm