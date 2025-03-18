import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Wrench, Clock, Puzzle, Search, Globe } from 'lucide-react'

const agents = [
  {
    title: "Build It!",
    description: "Turn your ideas into reality with step-by-step guidance, templates, and live debugging.",
    href: "/chat/build",
    icon: Wrench,
    color: "from-orange-500 to-pink-600"
  },
  {
    title: "Time-Traveling Agent",
    description: "Explore any topic through historical insights and future predictions.",
    href: "/chat/time",
    icon: Clock,
    color: "from-pink-500 to-purple-600"
  },
  {
    title: "Explain Like I'm 5",
    description: "Break down complex concepts with fun analogies and simple visuals.",
    href: "/chat/explain",
    icon: Puzzle,
    color: "from-purple-500 to-indigo-600"
  },
  {
    title: "What's Missing?",
    description: "Identify gaps in knowledge and discover overlooked perspectives.",
    href: "/chat/missing",
    icon: Search,
    color: "from-blue-500 to-cyan-600"
  },
  {
    title: "Cultural Lens",
    description: "Get answers enriched with diverse cultural viewpoints from around the world.",
    href: "/chat/cultural",
    icon: Globe,
    color: "from-cyan-500 to-teal-600"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-purple-100 dark:from-orange-950 dark:to-purple-950">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
            Meet Your AI Agents
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Each AI agent in Polymind is designed with a unique perspective and purpose. 
            Pick the one that fits your needs and start your journey!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {agents.map((agent) => (
            <Link key={agent.title} href={agent.href}>
              <Card className="group hover:scale-105 transition-all duration-200 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4">
                    <agent.icon className={`w-8 h-8 bg-gradient-to-br ${agent.color} p-1.5 rounded-lg text-white`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{agent.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {agent.description}
                  </CardDescription>
                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Talk to Agent
                    </button>
                    <button className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                      Learn more
                    </button>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
