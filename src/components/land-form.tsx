"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

const LandForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    cityStateZip: "",
    acreage: "",
    description: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      email: "",
    }
    let isValid = true

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
      isValid = false
    }

    // Phone validation
    const phoneRegex = /^[\d-]{10,}$/
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      isValid = false
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid phone number"
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly")
      return
    }

    setIsSubmitting(true)
    setSuccessMessage("")

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccessMessage("Thank you for your submission! We will contact you soon.")
        setFormData({ 
          name: "", 
          phone: "",
          email: "", 
          address: "", 
          cityStateZip: "", 
          acreage: "", 
          description: "" 
        })
        toast.success("Form submitted successfully!")
      } else {
        toast.error("Error submitting form. Please try again.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="lg:w-1/2 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-green-800 text-lg">
            Your Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`mt-1 bg-white/80 border-green-300 focus:border-green-500 focus:ring-green-500 ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="text-green-800 text-lg">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="123-456-7890"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`mt-1 bg-white/80 border-green-300 focus:border-green-500 focus:ring-green-500 ${
              errors.phone ? 'border-red-500' : ''
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="text-green-800 text-lg">
            Contact Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`mt-1 bg-white/80 border-green-300 focus:border-green-500 focus:ring-green-500 ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="address" className="text-green-800 text-lg">
            Property Address
          </Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 bg-white/80 border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <Label htmlFor="cityStateZip" className="text-green-800 text-lg">
            City, State, ZIP
          </Label>
          <Input
            id="cityStateZip"
            name="cityStateZip"
            value={formData.cityStateZip}
            onChange={handleChange}
            className="mt-1 bg-white/80 border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <Label htmlFor="acreage" className="text-green-800 text-lg">
            Acreage
          </Label>
          <Input
            id="acreage"
            name="acreage"
            type="number"
            min="0"
            step="0.01"
            value={formData.acreage}
            onChange={handleChange}
            className="mt-1 bg-white/80 border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <Label htmlFor="description" className="text-green-800 text-lg">
            Property Description
          </Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 w-full rounded-md border border-green-300 bg-white/80 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Tell us more about your property (optional)"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 transition-all duration-300 hover:scale-[1.02] relative"
          disabled={isSubmitting}
        >
          <span className={`flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-0' : ''}`}>
            Get My Cash Offer
          </span>
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner className="text-white" />
              <span className="ml-2">Submitting...</span>
            </div>
          )}
        </Button>
      </form>
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">{successMessage}</div>
      )}
    </div>
  )
}

export default LandForm
