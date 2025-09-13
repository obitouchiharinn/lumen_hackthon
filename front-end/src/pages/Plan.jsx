import { useState } from "react"
import { SlidersHorizontal, ArrowUpAZ, ArrowDownAZ, Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Main } from "@/components/layout/main"
import { PlanDialog } from "@/components/Plans/plan-add-dialog"
import { PlanEditDialog } from "@/components/Plans/plan-edit-dialog" // ✅ Import Edit Dialog

const appText = new Map([
  ["all", "All Plans"],
  ["monthly", "Monthly"],
  ["yearly", "Yearly"],
])

// ✅ Dummy plan data
const plans = [
  {
    id: 1,
    name: "Basic Plan",
    price: "₹499 / month",
    type: "monthly",
    description: "Perfect for individuals who are just getting started.",
    features: ["Access to core features", "Email support", "Single user access"],
  },
  {
    id: 2,
    name: "Pro Plan",
    price: "₹1299 / month",
    type: "monthly",
    description:
      "Ideal for growing teams who need more power and collaboration tools.",
    features: [
      "Everything in Basic",
      "Priority email support",
      "Up to 5 users",
      "Analytics dashboard",
    ],
  },
  {
    id: 3,
    name: "Enterprise Plan",
    price: "₹9999 / year",
    type: "yearly",
    description:
      "Tailored for large organizations that need enterprise-grade features.",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "Unlimited users",
    ],
  },
]

const Plan = () => {
  const [sort, setSort] = useState("asc")
  const [appType, setAppType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  // ✅ Filter + Sort
  const filteredPlans = [...plans]
    .sort((a, b) =>
      sort === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((plan) => (appType === "all" ? true : plan.type === appType))
    .filter((plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleEdit = (plan) => {
    setSelectedPlan(plan)
    setEditOpen(true)
  }

  return (
    <Main fixed className="flex flex-col h-100">
      {/* --- Header + Filters --- */}
      <div className="shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Plans</h1>
            <p className="text-muted-foreground">
              Manage your subscription plans below.
            </p>
          </div>

          {/* ✅ Add Plan Button */}
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Plan
          </Button>
        </div>

        <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Search plans..."
              className="h-9 w-40 lg:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={appType} onValueChange={setAppType}>
              <SelectTrigger className="w-36">
                <SelectValue>{appText.get(appType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-16">
              <SelectValue>
                <SlidersHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="asc">
                <div className="flex items-center gap-4">
                  <ArrowUpAZ size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center gap-4">
                  <ArrowDownAZ size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="shadow-sm" />
      </div>

      {/* --- Plan Cards --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-4 pb-16">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <li
              key={plan.id}
              className="rounded-lg border p-4 hover:shadow-md flex flex-col"
            >
              <h2 className="mb-2 font-bold text-lg">{plan.name}</h2>
              <p className="text-muted-foreground mb-2">{plan.price}</p>
              <p className="text-gray-500 mb-4">{plan.description}</p>
              <ul className="text-sm mb-4 list-disc list-inside text-gray-600">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                className="mt-auto"
                onClick={() => handleEdit(plan)}
              >
                <Pencil size={14} className="mr-2" />
                Edit
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Add Plan Dialog */}
      <PlanDialog open={open} onOpenChange={setOpen} />

      {/* ✅ Edit Plan Dialog */}
      <PlanEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        plan={selectedPlan}
      />
    </Main>
  )
}

export default Plan
