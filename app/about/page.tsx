import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Printer, Award, Users, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About TechCard Pro</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We are a leading provider of premium RFID cards, NFC technology, and custom 3D printing solutions. Since our
          founding, we've been committed to delivering innovative identification and prototyping solutions to businesses
          and individuals worldwide.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
          <p className="text-gray-600">Happy Customers</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
          <p className="text-gray-600">Countries Served</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
          <p className="text-gray-600">Customer Satisfaction</p>
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 mb-6 leading-relaxed">
            Founded in 2015, TechCard Pro began as a small startup with a vision to revolutionize the identification and
            access control industry. Our founders, experienced engineers and technology enthusiasts, recognized the
            growing need for reliable, high-quality RFID and NFC solutions in an increasingly connected world.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            What started as a focus on RFID cards quickly expanded to include cutting-edge NFC technology and custom 3D
            printing services. Today, we serve thousands of customers across multiple industries, from small businesses
            to large enterprises, providing them with the tools they need to secure their facilities and bring their
            ideas to life.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our commitment to quality, innovation, and customer service has made us a trusted partner for organizations
            worldwide. We continue to invest in research and development, ensuring that our products remain at the
            forefront of technology.
          </p>
        </div>
      </div>

      {/* Our Products */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Product Categories</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>RFID Cards</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                High-quality RFID cards for access control, identification, and security applications. Compatible with
                industry-standard readers and systems.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">125kHz</Badge>
                <Badge variant="secondary">13.56MHz</Badge>
                <Badge variant="secondary">UHF</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>NFC Cards</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Smart NFC cards and devices for modern connectivity solutions. Perfect for contactless payments, data
                sharing, and smart automation.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Business Cards</Badge>
                <Badge variant="secondary">Smart Tags</Badge>
                <Badge variant="secondary">Wearables</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Printer className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>3D Models</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Custom 3D printing services for prototypes, models, and unique objects. From concept to reality with
                precision and quality.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Prototypes</Badge>
                <Badge variant="secondary">Miniatures</Badge>
                <Badge variant="secondary">Custom Parts</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality First</h3>
            <p className="text-gray-600">
              We never compromise on quality. Every product undergoes rigorous testing to ensure it meets our high
              standards.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
            <p className="text-gray-600">
              Our customers are at the heart of everything we do. We listen, adapt, and continuously improve based on
              their feedback.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
            <p className="text-gray-600">
              We serve customers worldwide with fast, reliable shipping and localized support in multiple languages.
            </p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Work With Us?</h2>
        <p className="text-blue-100 mb-6">
          Whether you need RFID cards, NFC solutions, or custom 3D printing services, we're here to help bring your
          vision to life. Contact us today to discuss your project.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get In Touch
          </a>
          <a
            href="/products"
            className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </a>
        </div>
      </div>
    </div>
  )
}
