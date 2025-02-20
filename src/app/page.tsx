import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

const agents = [
  {
    title: "Cultural Agent",
    description: "Analyze and provide insights on cultural aspects and trends",
    href: "/chat/cultural",
    color: "bg-gradient-to-br from-pink-500 to-purple-600"
  },
  {
    title: "Build It Agent",
    description: "Help with construction and development tasks",
    href: "/chat/build",
    color: "bg-gradient-to-br from-blue-500 to-cyan-600"
  },
  {
    title: "What's Missing Agent",
    description: "Identify gaps and provide recommendations",
    href: "/chat/missing",
    color: "bg-gradient-to-br from-green-500 to-emerald-600"
  }
]

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Polymind Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Link key={agent.title} href={agent.href}>
            <Card className={`${agent.color} hover:scale-105 transition-transform duration-200 cursor-pointer h-[200px] text-white`}>
              <CardHeader>
                <CardTitle className="text-2xl">{agent.title}</CardTitle>
                <CardDescription className="text-gray-100">{agent.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
