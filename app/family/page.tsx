import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  Clock,
  HeartPulse,
  Baby,
  Users,
  Activity,
  Stethoscope,
  Phone,
  MapPin,
  Mail,
  ChevronRight,
} from "lucide-react";

export default function FamilyMedicinePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Link
        href="/"
        className="w-full h-[40px] group border border-[#0284c7] text-[#0284c7] px-4 py-2 flex items-center justify-center hover:bg-[#0284c7] hover:text-white transition"
      >
        Go to Home
        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#64748b] text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Family Medicine
                </h1>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  Care for the entire family, from newborns to seniors, building
                  lasting relationships with our patients.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-blue-300 border-black text-[#0284c7] hover:bg-white/90 font-bold">
                  Schedule Appointment
                </Button>
                <Button
                  variant="outline"
                  className="border-black text-white bg-blue-500 hover:bg-white/20"
                >
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=400&width=600"
                width={600}
                height={400}
                alt="Family doctor with patients"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#0284c7]">
                Comprehensive Care for Every Stage of Life
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our family medicine practice is dedicated to providing
                personalized, continuous, and comprehensive healthcare for
                individuals and families of all ages. We focus on building
                lasting relationships with our patients, understanding their
                unique health needs, and delivering care that evolves with them
                throughout their lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#0284c7]">
              Our Services
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
              We offer a wide range of healthcare services to meet the needs of
              your entire family.
            </p>
          </div>

          <Tabs defaultValue="preventive" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="preventive">Preventive Care</TabsTrigger>
              <TabsTrigger value="chronic">Chronic Disease</TabsTrigger>
              <TabsTrigger value="pediatric">Pediatric Care</TabsTrigger>
              <TabsTrigger value="geriatric">Geriatric Care</TabsTrigger>
            </TabsList>
            <TabsContent
              value="preventive"
              className="p-4 border rounded-lg mt-4"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-[#0284c7]/10 flex items-center justify-center">
                    <HeartPulse className="h-12 w-12 text-[#0284c7]" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2 text-[#0284c7]">
                    Preventive Care
                  </h3>
                  <p className="text-gray-600">
                    Our preventive care services include annual physicals,
                    immunizations, health screenings, and lifestyle counseling
                    to help you maintain optimal health and prevent disease.
                  </p>
                  <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Annual check-ups</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Immunizations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Health screenings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Wellness counseling</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="chronic" className="p-4 border rounded-lg mt-4">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-[#0284c7]/10 flex items-center justify-center">
                    <Activity className="h-12 w-12 text-[#0284c7]" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2 text-[#0284c7]">
                    Chronic Disease Management
                  </h3>
                  <p className="text-gray-600">
                    We provide ongoing care and management for chronic
                    conditions such as diabetes, hypertension, asthma, and heart
                    disease to help you maintain quality of life and prevent
                    complications.
                  </p>
                  <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Diabetes management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Hypertension treatment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Asthma care</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Heart disease monitoring</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="pediatric"
              className="p-4 border rounded-lg mt-4"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-[#0284c7]/10 flex items-center justify-center">
                    <Baby className="h-12 w-12 text-[#0284c7]" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2 text-[#0284c7]">
                    Pediatric Care
                  </h3>
                  <p className="text-gray-600">
                    Our pediatric services include well-child visits,
                    developmental screenings, immunizations, and treatment for
                    common childhood illnesses to ensure your child's healthy
                    growth and development.
                  </p>
                  <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Well-child visits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Developmental assessments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Childhood immunizations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Acute illness treatment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="geriatric"
              className="p-4 border rounded-lg mt-4"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-[#0284c7]/10 flex items-center justify-center">
                    <Users className="h-12 w-12 text-[#0284c7]" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2 text-[#0284c7]">
                    Geriatric Care
                  </h3>
                  <p className="text-gray-600">
                    Our geriatric care focuses on the unique health needs of
                    older adults, including management of multiple chronic
                    conditions, medication reviews, and preventive care to
                    maintain independence and quality of life.
                  </p>
                  <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Comprehensive assessments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Medication management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Fall prevention</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#0284c7]"></div>
                      <span>Chronic disease coordination</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Meet Our Doctors */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#0284c7]">
              Meet Our Doctors
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
              Our team of board-certified family physicians is dedicated to
              providing exceptional care for your entire family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Dr. Sarah Johnson"
                  className="w-full h-64 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 text-[#0284c7]">
                  Dr. Sarah Johnson
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 mb-4">
                  Board Certified Family Physician
                </CardDescription>
                <p className="text-sm text-gray-600">
                  Dr. Johnson has over 15 years of experience in family medicine
                  and specializes in women's health and pediatric care.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#0284c7] border-[#0284c7]"
                >
                  View Profile
                </Button>
                <Button
                  size="sm"
                  className="bg-[#0284c7] hover:bg-[#0284c7]/90"
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Dr. Michael Chen"
                  className="w-full h-64 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 text-[#0284c7]">
                  Dr. Michael Chen
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 mb-4">
                  Board Certified Family Physician
                </CardDescription>
                <p className="text-sm text-gray-600">
                  Dr. Chen focuses on preventive care and chronic disease
                  management with a special interest in diabetes and heart
                  health.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#0284c7] border-[#0284c7]"
                >
                  View Profile
                </Button>
                <Button
                  size="sm"
                  className="bg-[#0284c7] hover:bg-[#0284c7]/90"
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Dr. Lisa Rodriguez"
                  className="w-full h-64 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 text-[#0284c7]">
                  Dr. Lisa Rodriguez
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 mb-4">
                  Board Certified Family Physician
                </CardDescription>
                <p className="text-sm text-gray-600">
                  Dr. Rodriguez specializes in geriatric care and has extensive
                  experience in managing complex medical conditions in older
                  adults.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#0284c7] border-[#0284c7]"
                >
                  View Profile
                </Button>
                <Button
                  size="sm"
                  className="bg-[#0284c7] hover:bg-[#0284c7]/90"
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#0284c7]/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#0284c7]">
              Why Choose Our Family Medicine Practice
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
              We're committed to providing exceptional care for your entire
              family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4">
                <Stethoscope className="h-8 w-8 text-[#0284c7]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#0284c7]">
                Comprehensive Care
              </h3>
              <p className="text-gray-600">
                We provide a full spectrum of healthcare services for patients
                of all ages, from newborns to seniors.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-[#0284c7]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#0284c7]">
                Continuity of Care
              </h3>
              <p className="text-gray-600">
                We build lasting relationships with our patients, providing
                consistent care throughout all stages of life.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-[#0284c7]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#0284c7]">
                Convenient Scheduling
              </h3>
              <p className="text-gray-600">
                We offer flexible appointment times, including early morning and
                evening hours to accommodate busy schedules.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-[#0284c7]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#0284c7]">
                Same-Day Appointments
              </h3>
              <p className="text-gray-600">
                We reserve time each day for urgent care needs, ensuring you can
                see a doctor when you need one most.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-[#0284c7]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#0284c7]">
                Preventive Focus
              </h3>
              <p className="text-gray-600">
                We emphasize preventive care to help you maintain optimal health
                and prevent disease before it starts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#0284c7]/10 flex items-center justify-center mb-4">
                <HeartPulse className="h-8 w-8 text-[#0284c7]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#0284c7]">
                Patient-Centered Approach
              </h3>
              <p className="text-gray-600">
                We involve you in healthcare decisions and develop personalized
                treatment plans based on your unique needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#0284c7]">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
              Find answers to common questions about our family medicine
              practice.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  What ages do you treat?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Our family medicine practice provides care for patients of all
                  ages, from newborns to seniors. We offer comprehensive
                  healthcare services tailored to each stage of life.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  Do you accept new patients?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, we are currently accepting new patients of all ages. We
                  welcome the opportunity to provide care for you and your
                  family. You can schedule a new patient appointment by calling
                  our office or using our online scheduling system.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  What insurance plans do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  We accept most major insurance plans, including Medicare and
                  Medicaid. Please contact our office to verify that we accept
                  your specific insurance plan. Our staff will be happy to
                  assist you with insurance questions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  How do I schedule an appointment?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  You can schedule an appointment by calling our office during
                  business hours, using our online scheduling system on our
                  website, or through our patient portal if you are an existing
                  patient.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">
                  What should I bring to my first appointment?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Please bring your insurance card, photo ID, a list of current
                  medications (including dosages), your medical history, and any
                  recent lab results or medical records. Arriving 15 minutes
                  early to complete paperwork is recommended for new patients.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-medium">
                  Do you offer telehealth appointments?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, we offer telehealth appointments for certain types of
                  visits. Telehealth allows you to consult with your doctor from
                  the comfort of your home using video conferencing. Please call
                  our office to determine if your concern is appropriate for a
                  telehealth visit.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact/Appointment Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#0284c7]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Ready to Experience Better Healthcare?
                </h2>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  Schedule an appointment today and take the first step toward
                  comprehensive, personalized care for you and your family.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-white text-[#0284c7] hover:bg-white/90">
                  Schedule Appointment
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-[#0284c7]">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#0284c7] mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">
                      123 Health Avenue, Medical Center
                    </p>
                    <p className="text-gray-600">Anytown, ST 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#0284c7] mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">(123) 456-7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#0284c7] mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">info@familymedicine.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#0284c7] mt-0.5" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 5:00 PM
                    </p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-[#0284c7]">
              Your Family's Health Is Our Priority
            </h2>
            <p className="max-w-[600px] text-gray-500">
              Join our family medicine practice today and experience healthcare
              that grows with you.
            </p>
            <Button className="bg-[#0284c7] hover:bg-[#0284c7]/90 mt-2">
              Schedule Your First Visit
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-900 text-gray-300">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Family Medicine
              </h3>
              <p className="text-sm">
                Comprehensive healthcare for patients of all ages, from newborns
                to seniors.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Our Doctors
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Patient Portal
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
              <address className="text-sm not-italic">
                123 Health Avenue
                <br />
                Anytown, ST 12345
                <br />
                Phone: (123) 456-7890
                <br />
                Email: info@familymedicine.com
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
            <p>
              &copy; {new Date().getFullYear()} Family Medicine. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
