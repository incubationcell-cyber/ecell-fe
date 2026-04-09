'use client';

import React from "react"

import { useState } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'react-toastify';

type JoinFormPayload = {
  fullName: string;
  mobileNo: number;
  year: string;
  emailId: string;
  studentType: string;
  branch: string;
};

type SubmitResponse = {
  success: boolean;
  message?: string;
};

type JoinFormProps = {
  submitJoinFormAction: (payload: JoinFormPayload) => Promise<SubmitResponse>;
};

const currentYear = new Date().getFullYear();
const passoutYears = Array.from(
  { length: currentYear - 2004 + 1 },
  (_, index) => String(currentYear - index)
);

const regularYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

function mapStudentType(studentType: string) {
  if (studentType === 'hosteller') return 'Hosteller';
  if (studentType === 'dayscholar') return 'Dayscholar';
  if (studentType === 'alumni') return 'Alumni';
  return studentType;
}

export default function JoinForm({ submitJoinFormAction }: JoinFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '',
    studentType: '',
    branch: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAlumni = formData.studentType === 'alumni';
  const yearFieldLabel = isAlumni ? 'Passout Year' : 'Year of Study';
  const yearFieldPlaceholder = isAlumni ? 'Select your passout year' : 'Select your year';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'studentType' ? { year: '' } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.year ||
      !formData.studentType ||
      !formData.branch ||
      !formData.phone
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    const mobileNo = Number(formData.phone.replace(/\D/g, ''));
    if (!mobileNo) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    const payload: JoinFormPayload = {
      fullName: formData.name.trim(),
      mobileNo,
      year: formData.year,
      emailId: formData.email.trim(),
      studentType: mapStudentType(formData.studentType),
      branch: formData.branch,
    };

    try {
      const response = await submitJoinFormAction(payload);
      if (!response?.success) {
        toast.error(response?.message || 'Failed to submit form. Please try again.');
        return;
      }

      toast.success(response?.message || 'Form submitted successfully.');
      setFormData({
        name: '',
        email: '',
        year: '',
        studentType: '',
        branch: '',
        phone: '',
      });
    } catch (_error) {
      toast.error('Unable to submit form right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="join" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Join E-Cell
          </h2>
          <p className="text-xl text-muted-foreground">
            Take the first step towards your entrepreneurial journey with us
          </p>
        </div>

        <Card className="p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-semibold">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-background border-border text-foreground"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@jec.ac.in"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-background border-border text-foreground"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-semibold">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 9XXXXXXXXX"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-background border-border text-foreground"
                required
              />
            </div>

            {/* Student Type */}
            <div className="space-y-2">
              <Label htmlFor="studentType" className="text-foreground font-semibold">
                Student Type
              </Label>
              <Select
                value={formData.studentType}
                onValueChange={(value) => handleSelectChange('studentType', value)}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select student type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hosteller">Hosteller</SelectItem>
                  <SelectItem value="dayscholar">Dayscholar</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year or Passout Year */}
            <div className="space-y-2">
              <Label htmlFor="year" className="text-foreground font-semibold">
                {yearFieldLabel}
              </Label>
              <Select value={formData.year} onValueChange={(value) => handleSelectChange('year', value)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder={yearFieldPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {(isAlumni ? passoutYears : regularYears).map((yearOption) => (
                    <SelectItem key={yearOption} value={yearOption}>
                      {yearOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label htmlFor="branch" className="text-foreground font-semibold">
                Branch
              </Label>
              <Select value={formData.branch} onValueChange={(value) => handleSelectChange('branch', value)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics & Communication Engineering">Electronics & Communication Engineering</SelectItem>
                    <SelectItem value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Join E-Cell Now'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              By joining, you agree to receive updates about E-Cell events and opportunities.
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
}
