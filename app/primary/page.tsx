import Image from "next/image";
import {
  CalendarDays,
  Clock,
  HeartPulse,
  Shield,
  Users,
  Phone,
  MapPin,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function LearnMorePage() {
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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Comprehensive Healthcare
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Primary Care Services for Your Whole Family
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Personalized healthcare services for patients of all ages,
                  focusing on your overall health and wellness.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="inline-flex items-center justify-center"
                >
                  Schedule an Appointment
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </div>
            </div>
            <Image
              src="/placeholder.svg?height=550&width=550"
              width={550}
              height={550}
              alt="Doctor with patient"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Services
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We offer a wide range of primary care services to keep you and
                your family healthy.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <Card className="h-full">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <HeartPulse className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Preventive Care</CardTitle>
                <CardDescription>
                  Regular check-ups, screenings, and immunizations to prevent
                  illness and maintain health.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Annual physical examinations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Health risk assessments</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Immunizations for all ages</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
            <Card className="h-full">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Chronic Disease Management</CardTitle>
                <CardDescription>
                  Ongoing care for conditions like diabetes, hypertension, and
                  asthma.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Personalized treatment plans</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Medication management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Regular monitoring and follow-ups</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
            <Card className="h-full">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Family Medicine</CardTitle>
                <CardDescription>
                  Comprehensive healthcare for every member of your family, from
                  infants to seniors.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Pediatric care</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Women's and men's health</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    <span>Geriatric care</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose Our Primary Care?
              </h2>
              <p className="text-muted-foreground md:text-xl">
                We provide patient-centered care that focuses on building
                long-term relationships and improving your overall health.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Extended Hours</h3>
                    <p className="text-muted-foreground">
                      We offer early morning, evening, and weekend appointments
                      to accommodate your busy schedule.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Same-Day Appointments</h3>
                    <p className="text-muted-foreground">
                      Urgent health concerns can't wait. We reserve slots each
                      day for same-day appointments.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Telehealth Services</h3>
                    <p className="text-muted-foreground">
                      Connect with your doctor from the comfort of your home for
                      certain appointments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-xl lg:h-full">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Doctor with patient"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Meet Our Providers
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our team of experienced healthcare professionals is dedicated to
                providing you with the highest quality care.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Family Medicine",
                bio: "Board-certified with over 15 years of experience in family medicine.",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Dr. Michael Chen",
                role: "Internal Medicine",
                bio: "Specializes in adult medicine and chronic disease management.",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Dr. Emily Rodriguez",
                role: "Pediatrics",
                bio: "Passionate about children's health and developmental milestones.",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Dr. James Wilson",
                role: "Geriatrics",
                bio: "Dedicated to improving the quality of life for older adults.",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Amanda Thompson, NP",
                role: "Nurse Practitioner",
                bio: "Focuses on preventive care and patient education.",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Robert Davis, PA",
                role: "Physician Assistant",
                bio: "Experienced in diagnosing and treating common illnesses.",
                image: "/placeholder.svg?height=200&width=200",
              },
            ].map((provider, index) => (
              <Card key={index} className="text-center">
                <CardHeader className="pb-2">
                  <Avatar className="mx-auto h-24 w-24">
                    <AvatarImage src={provider.image} alt={provider.name} />
                    <AvatarFallback>
                      {provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle>{provider.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {provider.role}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground">
                    {provider.bio}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Patient Testimonials
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear what our patients have to say about their experiences with
                our primary care services.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
            {[
              {
                quote:
                  "Dr. Johnson has been my family's doctor for over 10 years. She always takes the time to listen and provides thoughtful care for all of us.",
                name: "Maria G.",
                location: "Patient since 2013",
              },
              {
                quote:
                  "The entire staff is friendly and professional. I appreciate how they follow up after appointments and make sure all my questions are answered.",
                name: "Thomas R.",
                location: "Patient since 2018",
              },
              {
                quote:
                  "As someone managing multiple chronic conditions, I value the coordinated care I receive. My doctor works with specialists to ensure I'm getting the best treatment.",
                name: "Eleanor W.",
                location: "Patient since 2015",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <svg
                    className="h-12 w-12 text-primary/40"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                  </svg>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{testimonial.quote}</p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find answers to common questions about our primary care
                services.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl py-12">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  What services does primary care include?
                </AccordionTrigger>
                <AccordionContent>
                  Primary care includes preventive care, diagnosis and treatment
                  of acute and chronic illnesses, health risk assessments,
                  immunizations, screening tests, and health education. Our
                  providers can also coordinate your care with specialists when
                  needed.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  How often should I see my primary care provider?
                </AccordionTrigger>
                <AccordionContent>
                  Most healthy adults should see their primary care provider
                  once a year for a wellness check-up. However, if you have
                  chronic conditions or ongoing health concerns, your doctor may
                  recommend more frequent visits.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Do you accept new patients?</AccordionTrigger>
                <AccordionContent>
                  Yes, we are currently accepting new patients of all ages. You
                  can call our office or use our online scheduling system to
                  book your first appointment.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  What insurance plans do you accept?
                </AccordionTrigger>
                <AccordionContent>
                  We accept most major insurance plans, including Medicare and
                  Medicaid. Please contact our office to verify that we accept
                  your specific insurance plan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  What should I bring to my first appointment?
                </AccordionTrigger>
                <AccordionContent>
                  Please bring your insurance card, photo ID, a list of current
                  medications (including dosages), your medical history, and any
                  recent lab or test results. Arriving 15 minutes early to
                  complete paperwork is recommended for new patients.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  Do you offer telehealth appointments?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, we offer telehealth appointments for certain types of
                  visits. These virtual appointments allow you to connect with
                  your provider from the comfort of your home. Not all
                  conditions can be treated via telehealth, so please call our
                  office to determine if your concern is appropriate for a
                  virtual visit.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Take Control of Your Health?
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Schedule an appointment today and take the first step towards
                better health and wellness.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="inline-flex items-center justify-center"
              >
                Schedule an Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Contact Information
              </h2>
              <p className="text-muted-foreground">
                We're here to answer your questions and help you schedule an
                appointment.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-bold">Address</h3>
                    <p className="text-muted-foreground">
                      123 Healthcare Avenue, Medical Center, Suite 200
                    </p>
                    <p className="text-muted-foreground">Anytown, ST 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-bold">Phone</h3>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-bold">Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 6:00 PM
                    </p>
                    <p className="text-muted-foreground">
                      Saturday: 9:00 AM - 1:00 PM
                    </p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
              <div className="h-[400px] w-full">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="Map location"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
