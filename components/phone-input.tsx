"use client"

import type React from "react"
import { forwardRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({ className, ...props }, ref) => {
  const [countryCode, setCountryCode] = useState("+1")

  const countryCodes = [
    { code: "+1", country: "US" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "IN" },
    { code: "+61", country: "AU" },
    { code: "+86", country: "CN" },
    { code: "+49", country: "DE" },
    { code: "+33", country: "FR" },
    { code: "+81", country: "JP" },
    { code: "+7", country: "RU" },
    { code: "+55", country: "BR" },
    { code: "+52", country: "MX" },
    { code: "+27", country: "ZA" },
    { code: "+971", country: "AE" },
    { code: "+65", country: "SG" },
  ]

  return (
    <div className="flex">
      <Select onValueChange={setCountryCode} defaultValue={countryCode}>
        <SelectTrigger className="w-[90px] rounded-r-none border-r-0">
          <SelectValue placeholder={countryCode} />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.code} {country.country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input type="tel" className={`rounded-l-none flex-1 ${className}`} ref={ref} {...props} />
    </div>
  )
})

PhoneInput.displayName = "PhoneInput"