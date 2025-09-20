"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Utensils,
  Apple,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Save,
  Plus,
  X,
  Info,
  Heart,
  Award,
  Clock,
  Droplets,
  Flame,
  Leaf,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Bell,
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  Settings,
  Upload,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";

// Types for our application
interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  category: string;
  tags: string[];
  description: string;
  ingredients: string[];
  preparationTime: number;
  cuisine?: string;
  featured?: boolean;
}

interface MealPlan {
  [day: string]: {
    breakfast: Meal | null;
    lunch: Meal | null;
    dinner: Meal | null;
    snacks: Meal[];
  };
}

interface Reminder {
  id: string;
  day: string;
  mealType: string;
  time: string;
  enabled: boolean;
  notifyByEmail?: boolean;
  notifyByPush?: boolean;
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const mealTypes = ["breakfast", "lunch", "dinner", "snacks"];

// Predefined meals including Indian cuisine
const predefinedMeals: Meal[] = [
  {
    id: "1",
    name: "Avocado Toast with Egg",
    calories: 350,
    protein: 15,
    carbs: 30,
    fat: 20,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2080&auto=format&fit=crop",
    category: "breakfast",
    tags: ["High Protein", "Vegetarian"],
    description:
      "Whole grain toast topped with mashed avocado, a poached egg, and red pepper flakes.",
    ingredients: [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "2 eggs",
      "Salt and pepper to taste",
      "Red pepper flakes",
      "1 tbsp olive oil",
    ],
    preparationTime: 15,
    cuisine: "Western",
  },
  {
    id: "2",
    name: "Greek Yogurt Parfait",
    calories: 280,
    protein: 18,
    carbs: 35,
    fat: 8,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1887&auto=format&fit=crop",
    category: "breakfast",
    tags: ["High Protein", "Low Fat"],
    description:
      "Layers of Greek yogurt, fresh berries, and granola for a quick and nutritious breakfast.",
    ingredients: [
      "1 cup Greek yogurt",
      "1/2 cup mixed berries",
      "1/4 cup granola",
      "1 tbsp honey",
    ],
    preparationTime: 5,
    cuisine: "Mediterranean",
  },
  {
    id: "3",
    name: "Quinoa Veggie Bowl",
    calories: 420,
    protein: 12,
    carbs: 65,
    fat: 14,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
    category: "lunch",
    tags: ["Vegan", "Gluten-Free"],
    description:
      "Nutrient-rich quinoa topped with roasted vegetables and a tahini dressing.",
    ingredients: [
      "1 cup cooked quinoa",
      "1 cup roasted vegetables (bell peppers, zucchini, onions)",
      "1/4 cup chickpeas",
      "2 tbsp tahini dressing",
      "Fresh herbs for garnish",
    ],
    preparationTime: 25,
    cuisine: "Mediterranean",
  },
  {
    id: "4",
    name: "Grilled Chicken Salad",
    calories: 380,
    protein: 35,
    carbs: 15,
    fat: 18,
    image:
      "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=1780&auto=format&fit=crop",
    category: "lunch",
    tags: ["High Protein", "Low Carb"],
    description:
      "Fresh mixed greens topped with grilled chicken, cherry tomatoes, cucumber, and balsamic vinaigrette.",
    ingredients: [
      "4 oz grilled chicken breast",
      "2 cups mixed greens",
      "1/2 cup cherry tomatoes",
      "1/2 cucumber, sliced",
      "2 tbsp balsamic vinaigrette",
      "1/4 avocado, sliced",
    ],
    preparationTime: 20,
    cuisine: "Western",
  },
  {
    id: "5",
    name: "Salmon with Roasted Vegetables",
    calories: 450,
    protein: 30,
    carbs: 25,
    fat: 25,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1887&auto=format&fit=crop",
    category: "dinner",
    tags: ["Omega-3", "Gluten-Free"],
    description:
      "Baked salmon fillet with a side of colorful roasted vegetables and herbs.",
    ingredients: [
      "6 oz salmon fillet",
      "2 cups mixed vegetables (broccoli, carrots, Brussels sprouts)",
      "2 tbsp olive oil",
      "2 cloves garlic, minced",
      "Fresh herbs (rosemary, thyme)",
      "Salt and pepper to taste",
    ],
    preparationTime: 30,
    cuisine: "Western",
  },
  {
    id: "6",
    name: "Vegetarian Chili",
    calories: 320,
    protein: 15,
    carbs: 45,
    fat: 10,
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=1770&auto=format&fit=crop",
    category: "dinner",
    tags: ["Vegetarian", "High Fiber"],
    description:
      "Hearty vegetarian chili with beans, vegetables, and warming spices.",
    ingredients: [
      "1 cup mixed beans (black beans, kidney beans)",
      "1 onion, diced",
      "1 bell pepper, diced",
      "2 cloves garlic, minced",
      "1 can diced tomatoes",
      "Chili spices (cumin, paprika, chili powder)",
      "1/4 cup vegetable broth",
    ],
    preparationTime: 40,
    cuisine: "Mexican",
  },
  {
    id: "7",
    name: "Apple with Almond Butter",
    calories: 200,
    protein: 5,
    carbs: 25,
    fat: 10,
    image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=1770&auto=format&fit=crop",
    category: "snacks",
    tags: ["Vegan", "Gluten-Free"],
    description:
      "Sliced apple with a tablespoon of almond butter for a satisfying snack.",
    ingredients: ["1 medium apple", "1 tbsp almond butter"],
    preparationTime: 2,
    cuisine: "Western",
  },
  {
    id: "8",
    name: "Hummus with Veggie Sticks",
    calories: 180,
    protein: 6,
    carbs: 20,
    fat: 8,
    image:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=1770&auto=format&fit=crop",
    category: "snacks",
    tags: ["Vegan", "Low Calorie"],
    description:
      "Creamy hummus served with fresh vegetable sticks for dipping.",
    ingredients: [
      "1/4 cup hummus",
      "1 cup mixed vegetable sticks (carrots, celery, bell peppers)",
    ],
    preparationTime: 5,
    cuisine: "Mediterranean",
  },
  {
    id: "9",
    name: "Overnight Oats",
    calories: 320,
    protein: 12,
    carbs: 45,
    fat: 10,
    image:
      "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1776&auto=format&fit=crop",
    category: "breakfast",
    tags: ["High Fiber", "Vegetarian"],
    description:
      "Oats soaked overnight with milk, chia seeds, and topped with fruits and nuts.",
    ingredients: [
      "1/2 cup rolled oats",
      "1/2 cup milk or plant-based alternative",
      "1 tbsp chia seeds",
      "1 tbsp maple syrup",
      "1/4 cup mixed berries",
      "1 tbsp chopped nuts",
    ],
    preparationTime: 5,
    cuisine: "Western",
  },
  {
    id: "10",
    name: "Turkey and Avocado Wrap",
    calories: 350,
    protein: 25,
    carbs: 30,
    fat: 15,
    image:
      "https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=1770&auto=format&fit=crop",
    category: "lunch",
    tags: ["High Protein", "Balanced"],
    description:
      "Whole grain wrap filled with lean turkey, avocado, lettuce, and mustard.",
    ingredients: [
      "1 whole grain wrap",
      "4 oz sliced turkey breast",
      "1/4 avocado, sliced",
      "1 cup lettuce",
      "1 tbsp mustard",
      "Sliced tomato",
    ],
    preparationTime: 10,
    cuisine: "Western",
  },
  {
    id: "11",
    name: "Stir-Fried Tofu with Vegetables",
    calories: 380,
    protein: 20,
    carbs: 35,
    fat: 18,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1770&auto=format&fit=crop",
    category: "dinner",
    tags: ["Vegetarian", "High Protein"],
    description:
      "Crispy tofu stir-fried with colorful vegetables in a savory sauce.",
    ingredients: [
      "8 oz firm tofu, cubed",
      "2 cups mixed vegetables (broccoli, carrots, snap peas)",
      "2 tbsp soy sauce",
      "1 tbsp sesame oil",
      "2 cloves garlic, minced",
      "1 tbsp ginger, minced",
      "1 tbsp cornstarch (for sauce thickening)",
    ],
    preparationTime: 25,
    cuisine: "Asian",
  },
  {
    id: "12",
    name: "Greek Yogurt with Honey",
    calories: 150,
    protein: 15,
    carbs: 15,
    fat: 3,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1887&auto=format&fit=crop",
    category: "snacks",
    tags: ["High Protein", "Probiotic"],
    description:
      "Creamy Greek yogurt drizzled with honey and a sprinkle of cinnamon.",
    ingredients: ["1 cup Greek yogurt", "1 tbsp honey", "Pinch of cinnamon"],
    preparationTime: 2,
    cuisine: "Mediterranean",
  },
  // Indian Meals
  {
    id: "13",
    name: "Masala Dosa",
    calories: 330,
    protein: 8,
    carbs: 58,
    fat: 9,
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1770&auto=format&fit=crop",
    category: "breakfast",
    tags: ["Vegetarian", "Traditional"],
    description:
      "Crispy fermented rice and lentil crepe filled with spiced potato filling, served with coconut chutney and sambar.",
    ingredients: [
      "1 cup rice",
      "1/4 cup urad dal",
      "2 potatoes, boiled and mashed",
      "1 onion, chopped",
      "1 tsp mustard seeds",
      "1 tsp cumin seeds",
      "Curry leaves",
      "Green chilies",
      "Turmeric powder",
      "Coconut chutney",
      "Sambar",
    ],
    preparationTime: 40,
    cuisine: "Indian",
  },
  {
    id: "14",
    name: "Paneer Butter Masala",
    calories: 450,
    protein: 22,
    carbs: 15,
    fat: 35,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1770&auto=format&fit=crop",
    category: "lunch",
    tags: ["Vegetarian", "Rich", "Creamy"],
    description:
      "Soft paneer cubes in a rich, creamy tomato-based gravy with aromatic spices.",
    ingredients: [
      "250g paneer, cubed",
      "2 tomatoes, pureed",
      "1 onion, finely chopped",
      "2 tbsp butter",
      "1 tbsp ginger-garlic paste",
      "1/2 cup cream",
      "1 tsp garam masala",
      "1 tsp red chili powder",
      "1/2 tsp turmeric",
      "Salt to taste",
      "Fresh coriander for garnish",
    ],
    preparationTime: 30,
    cuisine: "Indian",
    featured: true,
  },
  {
    id: "15",
    name: "Chicken Biryani",
    calories: 550,
    protein: 30,
    carbs: 65,
    fat: 20,
    image:
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1770&auto=format&fit=crop",
    category: "dinner",
    tags: ["High Protein", "Aromatic", "Festive"],
    description:
      "Fragrant basmati rice layered with marinated chicken and aromatic spices, slow-cooked to perfection.",
    ingredients: [
      "2 cups basmati rice",
      "500g chicken pieces",
      "2 onions, thinly sliced",
      "2 tomatoes, chopped",
      "2 tbsp ginger-garlic paste",
      "2 tbsp biryani masala",
      "1/2 cup yogurt",
      "Mint and coriander leaves",
      "Saffron strands soaked in milk",
      "Ghee",
      "Whole spices (bay leaf, cinnamon, cardamom, cloves)",
    ],
    preparationTime: 60,
    cuisine: "Indian",
    featured: true,
  },
  {
    id: "16",
    name: "Chana Masala",
    calories: 320,
    protein: 15,
    carbs: 50,
    fat: 8,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1771&auto=format&fit=crop",
    category: "lunch",
    tags: ["Vegetarian", "High Fiber", "Protein-Rich"],
    description:
      "Spicy chickpea curry cooked with onions, tomatoes, and a blend of aromatic spices.",
    ingredients: [
      "2 cups chickpeas, soaked and boiled",
      "2 onions, finely chopped",
      "2 tomatoes, pureed",
      "2 tbsp oil",
      "1 tbsp ginger-garlic paste",
      "1 tsp cumin seeds",
      "1 tsp coriander powder",
      "1/2 tsp turmeric",
      "1 tsp garam masala",
      "Red chili powder to taste",
      "Fresh coriander for garnish",
    ],
    preparationTime: 25,
    cuisine: "Indian",
  },
  {
    id: "17",
    name: "Aloo Paratha",
    calories: 280,
    protein: 7,
    carbs: 45,
    fat: 10,
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1771&auto=format&fit=crop",
    category: "breakfast",
    tags: ["Vegetarian", "Filling", "Traditional"],
    description:
      "Whole wheat flatbread stuffed with spiced mashed potatoes, typically served with yogurt or pickle.",
    ingredients: [
      "2 cups whole wheat flour",
      "3 potatoes, boiled and mashed",
      "1 onion, finely chopped",
      "Green chilies, chopped",
      "1 tsp cumin seeds",
      "1/2 tsp garam masala",
      "Fresh coriander, chopped",
      "Salt to taste",
      "Ghee or oil for cooking",
    ],
    preparationTime: 30,
    cuisine: "Indian",
  },
  {
    id: "18",
    name: "Palak Paneer",
    calories: 350,
    protein: 18,
    carbs: 12,
    fat: 25,
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107aa8e1fa?q=80&w=1770&auto=format&fit=crop",
    category: "dinner",
    tags: ["Vegetarian", "Iron-Rich", "Creamy"],
    description:
      "Cottage cheese cubes in a creamy spinach gravy, flavored with aromatic spices.",
    ingredients: [
      "250g paneer, cubed",
      "500g spinach, blanched and pureed",
      "1 onion, finely chopped",
      "1 tomato, chopped",
      "2 tbsp oil or ghee",
      "1 tbsp ginger-garlic paste",
      "1 tsp cumin seeds",
      "1/2 tsp garam masala",
      "1/4 cup cream",
      "Salt to taste",
    ],
    preparationTime: 35,
    cuisine: "Indian",
  },
  {
    id: "19",
    name: "Samosa",
    calories: 250,
    protein: 5,
    carbs: 30,
    fat: 15,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1771&auto=format&fit=crop",
    category: "snacks",
    tags: ["Vegetarian", "Crispy", "Popular"],
    description:
      "Crispy fried pastry filled with spiced potatoes and peas, served with mint and tamarind chutneys.",
    ingredients: [
      "2 cups all-purpose flour",
      "2 potatoes, boiled and mashed",
      "1/2 cup peas",
      "1 onion, finely chopped",
      "1 tsp cumin seeds",
      "1 tsp coriander powder",
      "1/2 tsp garam masala",
      "Green chilies, chopped",
      "Fresh coriander, chopped",
      "Oil for deep frying",
    ],
    preparationTime: 45,
    cuisine: "Indian",
  },
  {
    id: "20",
    name: "Bhel Puri",
    calories: 180,
    protein: 4,
    carbs: 30,
    fat: 6,
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1771&auto=format&fit=crop",
    category: "snacks",
    tags: ["Vegetarian", "Tangy", "Street Food"],
    description:
      "Popular Indian street food made with puffed rice, vegetables, and tangy chutneys.",
    ingredients: [
      "2 cups puffed rice",
      "1 potato, boiled and cubed",
      "1 onion, finely chopped",
      "1 tomato, chopped",
      "1/2 cup sev (crispy noodles)",
      "Tamarind chutney",
      "Mint-coriander chutney",
      "Chaat masala",
      "Fresh coriander for garnish",
    ],
    preparationTime: 15,
    cuisine: "Indian",
  },
  // Additional Indian Healthy Dishes
  {
    id: "21",
    name: "Ragi Dosa",
    calories: 180,
    protein: 6,
    carbs: 30,
    fat: 4,
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1770&auto=format&fit=crop",
    category: "breakfast",
    tags: ["Gluten-Free", "High Fiber", "Low Fat"],
    description:
      "Nutritious dosa made with finger millet (ragi) flour, rich in calcium and iron.",
    ingredients: [
      "1 cup ragi flour",
      "1/4 cup rice flour",
      "1 tbsp fenugreek seeds, soaked",
      "1 small onion, finely chopped",
      "1 green chili, chopped",
      "Curry leaves",
      "Salt to taste",
      "Oil for cooking",
    ],
    preparationTime: 20,
    cuisine: "Indian",
  },
  {
    id: "22",
    name: "Moong Dal Khichdi",
    calories: 310,
    protein: 14,
    carbs: 55,
    fat: 5,
    image:
      "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1830&auto=format&fit=crop",
    category: "lunch",
    tags: ["Protein-Rich", "Easy Digestion", "Comfort Food"],
    description:
      "A light and nutritious one-pot meal made with rice and yellow moong dal, perfect for easy digestion.",
    ingredients: [
      "1/2 cup rice",
      "1/2 cup yellow moong dal",
      "1 tsp cumin seeds",
      "1/2 tsp turmeric powder",
      "1 tbsp ghee",
      "1 inch ginger, grated",
      "Green chilies (optional)",
      "Salt to taste",
      "Fresh coriander for garnish",
    ],
    preparationTime: 25,
    cuisine: "Indian",
  },
  {
    id: "23",
    name: "Baingan Bharta",
    calories: 165,
    protein: 5,
    carbs: 18,
    fat: 9,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1771&auto=format&fit=crop",
    category: "dinner",
    tags: ["Low Calorie", "Vegetarian", "Smoky"],
    description:
      "Smoky roasted eggplant mash cooked with onions, tomatoes, and spices.",
    ingredients: [
      "1 large eggplant",
      "2 tomatoes, chopped",
      "1 onion, finely chopped",
      "2 green chilies, chopped",
      "1 tbsp oil",
      "1 tsp cumin seeds",
      "1 tsp ginger-garlic paste",
      "1/2 tsp red chili powder",
      "1/2 tsp garam masala",
      "Fresh coriander for garnish",
    ],
    preparationTime: 40,
    cuisine: "Indian",
  },
  {
    id: "24",
    name: "Sprouts Salad",
    calories: 120,
    protein: 8,
    carbs: 20,
    fat: 2,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1770&auto=format&fit=crop",
    category: "snacks",
    tags: ["High Protein", "Raw", "Detox"],
    description:
      "Nutritious salad made with mixed sprouts, vegetables, and a tangy lemon dressing.",
    ingredients: [
      "2 cups mixed sprouts (moong, chana)",
      "1 cucumber, diced",
      "1 tomato, diced",
      "1 onion, finely chopped",
      "1 green chili, chopped",
      "Juice of 1 lemon",
      "Chaat masala",
      "Salt to taste",
      "Fresh coriander for garnish",
    ],
    preparationTime: 10,
    cuisine: "Indian",
  },
  {
    id: "25",
    name: "Oats Idli",
    calories: 150,
    protein: 7,
    carbs: 25,
    fat: 3,
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1770&auto=format&fit=crop",
    category: "breakfast",
    tags: ["Heart-Healthy", "Low Fat", "High Fiber"],
    description:
      "Soft and fluffy idlis made with oats, a healthier twist to the traditional South Indian breakfast.",
    ingredients: [
      "1 cup oats",
      "1/2 cup semolina (rava)",
      "1/2 cup yogurt",
      "1 carrot, grated",
      "1 green chili, chopped",
      "1/2 tsp mustard seeds",
      "1/2 tsp cumin seeds",
      "Curry leaves",
      "Salt to taste",
    ],
    preparationTime: 30,
    cuisine: "Indian",
  },
  {
    id: "26",
    name: "Vegetable Upma",
    calories: 220,
    protein: 6,
    carbs: 40,
    fat: 5,
    image:
      "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1830&auto=format&fit=crop",
    category: "breakfast",
    tags: ["Quick", "Nutritious", "Fiber-Rich"],
    description:
      "A savory semolina breakfast dish cooked with mixed vegetables and spices.",
    ingredients: [
      "1 cup semolina (rava)",
      "1 cup mixed vegetables (carrots, peas, beans), chopped",
      "1 onion, finely chopped",
      "1 green chili, chopped",
      "1 tsp mustard seeds",
      "1 tsp cumin seeds",
      "1 tbsp oil or ghee",
      "Curry leaves",
      "Fresh coriander for garnish",
    ],
    preparationTime: 20,
    cuisine: "Indian",
  },
  {
    id: "27",
    name: "Lauki Kofta Curry",
    calories: 280,
    protein: 8,
    carbs: 30,
    fat: 15,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1771&auto=format&fit=crop",
    category: "dinner",
    tags: ["Low Calorie", "Vegetarian", "Nutritious"],
    description:
      "Bottle gourd dumplings in a spiced tomato-based gravy, a lighter alternative to traditional koftas.",
    ingredients: [
      "1 medium bottle gourd (lauki), grated",
      "2 tbsp besan (gram flour)",
      "2 tomatoes, pureed",
      "1 onion, finely chopped",
      "1 tsp ginger-garlic paste",
      "1/2 tsp turmeric powder",
      "1 tsp garam masala",
      "1 tsp coriander powder",
      "1/2 tsp cumin powder",
      "Fresh coriander for garnish",
    ],
    preparationTime: 45,
    cuisine: "Indian",
  },
  {
    id: "28",
    name: "Ragi Porridge",
    calories: 180,
    protein: 5,
    carbs: 35,
    fat: 2,
    image:
      "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1776&auto=format&fit=crop",
    category: "breakfast",
    tags: ["Calcium-Rich", "Gluten-Free", "Diabetic-Friendly"],
    description:
      "Nutritious porridge made with finger millet (ragi), known for its high calcium content.",
    ingredients: [
      "1/4 cup ragi flour",
      "2 cups milk or water",
      "2 tbsp jaggery or honey",
      "1/4 tsp cardamom powder",
      "Nuts for garnish (almonds, cashews)",
    ],
    preparationTime: 15,
    cuisine: "Indian",
  },
];

// Nutrition tips for educational content
const nutritionTips = [
  {
    id: "tip1",
    title: "Balanced Nutrition",
    icon: <Heart className="h-5 w-5 text-red-500" />,
    content:
      "Aim for a balanced plate with 1/2 vegetables, 1/4 protein, and 1/4 whole grains. Include a variety of colors to ensure you're getting different nutrients.",
  },
  {
    id: "tip2",
    title: "Portion Control",
    icon: <Award className="h-5 w-5 text-amber-500" />,
    content:
      "Be mindful of portion sizes. Use smaller plates, measure servings, and listen to your body's hunger cues. Remember that restaurant portions are often 2-3 times larger than recommended serving sizes.",
  },
  {
    id: "tip3",
    title: "Meal Prep Benefits",
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    content:
      "Planning meals in advance helps you make healthier choices, save money, reduce food waste, and save time during busy weekdays. Set aside 2-3 hours on the weekend to prep meals for the week.",
  },
  {
    id: "tip4",
    title: "Hydration",
    icon: <Droplets className="h-5 w-5 text-cyan-500" />,
    content:
      "Stay hydrated by drinking water throughout the day. Aim for 8 glasses daily, and more if you're active or in hot weather. Herbal teas and infused water can be great alternatives.",
  },
  {
    id: "tip5",
    title: "Protein Importance",
    icon: <Flame className="h-5 w-5 text-orange-500" />,
    content:
      "Protein is essential for muscle repair and growth. Include a source of protein in each meal. Good sources include lean meats, fish, eggs, dairy, legumes, tofu, and tempeh.",
  },
  {
    id: "tip6",
    title: "Mindful Eating",
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
    content:
      "Eat slowly and without distractions. Pay attention to hunger and fullness cues. This helps prevent overeating and improves digestion and satisfaction from meals.",
  },
  {
    id: "tip7",
    title: "Plant-Based Benefits",
    icon: <Leaf className="h-5 w-5 text-green-500" />,
    content:
      "Try incorporating more plant-based meals into your week. Plant foods are rich in fiber, vitamins, minerals, and antioxidants that support overall health and reduce risk of chronic diseases.",
  },
  {
    id: "tip8",
    title: "Spices in Indian Cuisine",
    icon: <Flame className="h-5 w-5 text-red-600" />,
    content:
      "Indian spices like turmeric, cumin, and coriander not only add flavor but also offer health benefits. Turmeric contains curcumin, which has anti-inflammatory properties, while cumin aids digestion.",
  },
  {
    id: "tip9",
    title: "Whole Grains",
    icon: <Leaf className="h-5 w-5 text-amber-700" />,
    content:
      "Choose whole grains like brown rice, quinoa, and whole wheat over refined grains. They contain more fiber, vitamins, and minerals, and help maintain steady blood sugar levels.",
  },
  {
    id: "tip10",
    title: "Healthy Fats",
    icon: <Droplets className="h-5 w-5 text-yellow-500" />,
    content:
      "Include sources of healthy fats like avocados, nuts, seeds, and olive oil. They support brain health, hormone production, and help absorb fat-soluble vitamins.",
  },
];

export default function MealPlanner() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>(predefinedMeals);
  const [activeMealType, setActiveMealType] = useState<string>("all");
  const [activeCuisine, setActiveCuisine] = useState<string>("all");
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => {
    // Initialize meal plan structure
    const initialPlan: MealPlan = {};
    days.forEach((day) => {
      initialPlan[day] = {
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: [],
      };
    });
    return initialPlan;
  });
  const [activeDay, setActiveDay] = useState(days[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPlan, setSavingPlan] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminders, setShowReminders] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    day: days[0],
    mealType: "breakfast",
    time: "08:00",
    enabled: true,
    notifyByEmail: true,
    notifyByPush: true,
  });
  const [showNotificationPermission, setShowNotificationPermission] =
    useState(false);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 75,
    carbs: 250,
    fat: 65,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showLottieUploader, setShowLottieUploader] = useState(false);
  const [customLottieUrl, setCustomLottieUrl] = useState("");
  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsAuthenticated(!!currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load meal plan from Firebase if user is authenticated
  useEffect(() => {
    if (user) {
      const userMealPlanRef = doc(db, "mealPlans", user.uid);

      getDoc(userMealPlanRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setMealPlan(docSnap.data() as MealPlan);
          }
        })
        .catch((error) => {
          console.error("Error loading meal plan:", error);
        });

      // Load reminders
      const userRemindersRef = doc(db, "reminders", user.uid);
      getDoc(userRemindersRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setReminders(docSnap.data().reminders || []);
          }
        })
        .catch((error) => {
          console.error("Error loading reminders:", error);
        });

      // Load nutrition goals
      const userNutritionGoalsRef = doc(db, "nutritionGoals", user.uid);
      getDoc(userNutritionGoalsRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setNutritionGoals(docSnap.data() as NutritionGoals);
          }
        })
        .catch((error) => {
          console.error("Error loading nutrition goals:", error);
        });
    }
  }, [user]);

  // Filter meals by type and cuisine
  useEffect(() => {
    let filtered = predefinedMeals;

    // Filter by meal type
    if (activeMealType !== "all") {
      filtered = filtered.filter((meal) => meal.category === activeMealType);
    }

    // Filter by cuisine
    if (activeCuisine !== "all") {
      filtered = filtered.filter((meal) => meal.cuisine === activeCuisine);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (meal) =>
          meal.name.toLowerCase().includes(query) ||
          meal.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          meal.description.toLowerCase().includes(query) ||
          (meal.cuisine && meal.cuisine.toLowerCase().includes(query))
      );
    }

    setFilteredMeals(filtered);
  }, [activeMealType, activeCuisine, searchQuery]);

  // Set featured meals
  useEffect(() => {
    const featured = predefinedMeals.filter((meal) => meal.featured);
    setFeaturedMeals(
      featured.length > 0 ? featured : predefinedMeals.slice(0, 3)
    );
  }, []);

  // Show a random nutrition tip every 30 seconds
  useEffect(() => {
    if (!showTip) {
      const timer = setTimeout(() => {
        setCurrentTip(Math.floor(Math.random() * nutritionTips.length));
        setShowTip(true);

        // Hide the tip after 10 seconds
        const hideTimer = setTimeout(() => {
          setShowTip(false);
        }, 10000);

        return () => clearTimeout(hideTimer);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [showTip]);

  // Check for meal reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentDay = days[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Convert to our day format
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      reminders.forEach((reminder) => {
        if (
          reminder.enabled &&
          reminder.day === currentDay &&
          reminder.time === currentTime
        ) {
          // Show in-app notification
          toast({
            title: "Meal Reminder",
            description: `Time for ${reminder.mealType} on ${reminder.day}!`,
            duration: 10000,
          });

          // Show browser notification if permission granted
          if (
            reminder.notifyByPush &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("Meal Planner Reminder", {
              body: `Time for ${reminder.mealType} on ${reminder.day}!`,
              icon: "/favicon.ico",
            });
          }

          // In a real app, we would send an email here if reminder.notifyByEmail is true
          if (reminder.notifyByEmail) {
            console.log(
              `Email notification would be sent for ${reminder.mealType} on ${reminder.day}`
            );
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive",
      });
      return;
    }

    if (Notification.permission === "granted") {
      toast({
        title: "Notifications already enabled",
        description: "You've already granted permission for notifications",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive notifications for meal reminders",
          variant: "success",
        });
      } else {
        toast({
          title: "Notifications disabled",
          description: "You won't receive notifications for meal reminders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "Error",
        description: "Failed to request notification permission",
        variant: "destructive",
      });
    }
  };

  const addToMealPlan = (meal: Meal, day: string, mealType: string) => {
    setMealPlan((prev) => {
      const newPlan = { ...prev };
      if (mealType === "snacks") {
        newPlan[day].snacks = [...(newPlan[day].snacks || []), meal];
      } else {
        newPlan[day][mealType as "breakfast" | "lunch" | "dinner"] = meal;
      }
      return newPlan;
    });

    // Show success notification
    setSuccessMessage(`${meal.name} added to ${day}'s ${mealType}`);
    setShowSuccessNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);

    // Also show toast
    toast({
      title: "Added to meal plan",
      description: `${meal.name} added to ${day}'s ${mealType}`,
      variant: "success",
    });
  };

  const removeFromMealPlan = (
    day: string,
    mealType: string,
    index?: number
  ) => {
    setMealPlan((prev) => {
      const newPlan = { ...prev };
      if (mealType === "snacks" && typeof index === "number") {
        newPlan[day].snacks = newPlan[day].snacks.filter((_, i) => i !== index);
      } else {
        newPlan[day][mealType as "breakfast" | "lunch" | "dinner"] = null;
      }
      return newPlan;
    });

    toast({
      title: "Removed from meal plan",
      description: `Meal removed from ${day}'s ${mealType}`,
    });
  };

  const saveMealPlan = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your meal plan",
        variant: "destructive",
      });
      router.push("/auth");
      return;
    }

    setSavingPlan(true);
    try {
      await setDoc(doc(db, "mealPlans", user.uid), mealPlan);

      // Also save reminders
      if (reminders.length > 0) {
        await setDoc(doc(db, "reminders", user.uid), { reminders });
      }

      // Also save nutrition goals
      await setDoc(doc(db, "nutritionGoals", user.uid), nutritionGoals);

      // Show success notification
      setSuccessMessage("Your meal plan has been saved successfully");
      setShowSuccessNotification(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);

      toast({
        title: "Meal plan saved",
        description: "Your meal plan has been saved successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to save meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingPlan(false);
    }
  };

  const addReminder = () => {
    if (!newReminder.day || !newReminder.mealType || !newReminder.time) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for the reminder",
        variant: "destructive",
      });
      return;
    }

    const reminder: Reminder = {
      id: `reminder-${Date.now()}`,
      day: newReminder.day,
      mealType: newReminder.mealType,
      time: newReminder.time,
      enabled: newReminder.enabled || true,
      notifyByEmail: newReminder.notifyByEmail || false,
      notifyByPush: newReminder.notifyByPush || false,
    };

    setReminders((prev) => [...prev, reminder]);
    setNewReminder({
      day: days[0],
      mealType: "breakfast",
      time: "08:00",
      enabled: true,
      notifyByEmail: true,
      notifyByPush: true,
    });

    // Show success notification
    setSuccessMessage(
      `Reminder set for ${reminder.mealType} on ${reminder.day} at ${reminder.time}`
    );
    setShowSuccessNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);

    toast({
      title: "Reminder added",
      description: `Reminder set for ${reminder.mealType} on ${reminder.day} at ${reminder.time}`,
      variant: "success",
    });

    // Check if push notifications are enabled
    if (reminder.notifyByPush && Notification.permission !== "granted") {
      setShowNotificationPermission(true);
    }
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? { ...reminder, enabled: !reminder.enabled }
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
    toast({
      title: "Reminder deleted",
      description: "Your meal reminder has been deleted",
    });
  };

  const calculateDailyNutrition = (day: string) => {
    const meals = mealPlan[day];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    // Add breakfast nutrition
    if (meals.breakfast) {
      totalCalories += meals.breakfast.calories;
      totalProtein += meals.breakfast.protein;
      totalFat += meals.breakfast.fat;
      totalCarbs += meals.breakfast.carbs;
    }

    // Add lunch nutrition
    if (meals.lunch) {
      totalCalories += meals.lunch.calories;
      totalProtein += meals.lunch.protein;
      totalFat += meals.lunch.fat;
      totalCarbs += meals.lunch.carbs;
    }

    // Add dinner nutrition
    if (meals.dinner) {
      totalCalories += meals.dinner.calories;
      totalProtein += meals.dinner.protein;
      totalFat += meals.dinner.fat;
      totalCarbs += meals.dinner.carbs;
    }

    // Add snacks nutrition
    meals.snacks.forEach((snack) => {
      totalCalories += snack.calories;
      totalProtein += snack.protein;
      totalFat += snack.fat;
      totalCarbs += snack.carbs;
    });

    return {
      calories: totalCalories,
      protein: totalProtein,
      fat: totalFat,
      carbs: totalCarbs,
    };
  };

  const calculateNutritionPercentage = (
    day: string,
    nutrient: keyof NutritionGoals
  ) => {
    const dailyNutrition = calculateDailyNutrition(day);
    const percentage =
      (dailyNutrition[nutrient] / nutritionGoals[nutrient]) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const getNutrientColor = (percentage: number) => {
    if (percentage < 25) return "bg-blue-500";
    if (percentage < 50) return "bg-green-500";
    if (percentage < 75) return "bg-yellow-500";
    if (percentage < 90) return "bg-orange-500";
    return "bg-red-500";
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return <Coffee className="h-5 w-5" />;
      case "lunch":
        return <Sun className="h-5 w-5" />;
      case "dinner":
        return <Moon className="h-5 w-5" />;
      case "snacks":
        return <Cookie className="h-5 w-5" />;
      default:
        return <Utensils className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Loading your meal planner
          </h2>
          <p className="text-gray-500">
            Preparing your personalized experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center"
          >
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Nutrition Tip */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md"
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {nutritionTips[currentTip].icon}
                  <div>
                    <h4 className="font-medium text-sm">
                      {nutritionTips[currentTip].title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {nutritionTips[currentTip].content}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => setShowTip(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="hover:bg-[#0284c7]/10 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-xl font-bold flex items-center">
                <Utensils className="h-5 w-5 mr-2 text-[#0284c7]" />
                Meal Planner
              </h1>
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowReminders(true)}
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    {reminders.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {reminders.length}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Meal Reminders</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isAuthenticated ? (
              <Button
                variant="default"
                onClick={saveMealPlan}
                disabled={savingPlan}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md"
              >
                <Save className="h-4 w-4 mr-2" />
                {savingPlan ? "Saving..." : "Save Plan"}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push("/auth")}
                className="hover:bg-[#0284c7]/10 transition-colors"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {/* Featured Meals Carousel */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Flame className="h-5 w-5 mr-2 text-orange-500" />
            Featured Recipes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredMeals.map((meal) => (
              <motion.div
                key={meal.id}
                whileHover={{ scale: 1.03 }}
                className="transition-all duration-300"
              >
                <Card className="overflow-hidden h-full border-0 shadow-lg">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={meal.image || "/placeholder.svg"}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <h3 className="font-bold">{meal.name}</h3>
                        <p className="text-sm opacity-90">
                          {meal.cuisine} Cuisine
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 text-orange-500 mr-1" />
                        <span className="text-sm font-medium">
                          {meal.calories} cal
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {meal.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMeal(meal)}
                      >
                        View Details
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add to Meal Plan</DialogTitle>
                            <DialogDescription>
                              Select a day and meal type to add this meal to
                              your plan.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <h4 className="mb-2 text-sm font-medium">
                                Select Day
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {days.map((day) => (
                                  <Button
                                    key={day}
                                    variant={
                                      selectedDay === day
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setSelectedDay(day)}
                                  >
                                    {day}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="mb-2 text-sm font-medium">
                                Select Meal
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {mealTypes.map((type) => (
                                  <Button
                                    key={type}
                                    variant={
                                      selectedMealType === type
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setSelectedMealType(type)}
                                  >
                                    {type.charAt(0).toUpperCase() +
                                      type.slice(1)}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              disabled={!selectedDay || !selectedMealType}
                              onClick={() => {
                                if (selectedDay && selectedMealType) {
                                  addToMealPlan(
                                    meal,
                                    selectedDay,
                                    selectedMealType
                                  );
                                  setSelectedDay(null);
                                  setSelectedMealType(null);
                                }
                              }}
                            >
                              Add to Plan
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Meal Library */}
          <div className="lg:col-span-5 xl:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-0 shadow-md">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                  <CardTitle className="flex items-center text-lg">
                    <Apple className="h-5 w-5 mr-2 text-green-500" />
                    Meal Library
                  </CardTitle>
                  <CardDescription>
                    Browse our collection of healthy meals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  {/* Search and Filter */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search meals..."
                        className="pl-8 border-blue-200 focus:border-blue-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-blue-200"
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Meal Type</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant={
                                  activeMealType === "all"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setActiveMealType("all")}
                              >
                                All Types
                              </Button>
                              {mealTypes.map((type) => (
                                <Button
                                  key={type}
                                  variant={
                                    activeMealType === type
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => setActiveMealType(type)}
                                >
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Cuisine</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant={
                                  activeCuisine === "all"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setActiveCuisine("all")}
                              >
                                All Cuisines
                              </Button>
                              <Button
                                variant={
                                  activeCuisine === "Indian"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setActiveCuisine("Indian")}
                              >
                                Indian
                              </Button>
                              <Button
                                variant={
                                  activeCuisine === "Western"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setActiveCuisine("Western")}
                              >
                                Western
                              </Button>
                              <Button
                                variant={
                                  activeCuisine === "Mediterranean"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  setActiveCuisine("Mediterranean")
                                }
                              >
                                Mediterranean
                              </Button>
                              <Button
                                variant={
                                  activeCuisine === "Asian"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setActiveCuisine("Asian")}
                              >
                                Asian
                              </Button>
                              <Button
                                variant={
                                  activeCuisine === "Mexican"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setActiveCuisine("Mexican")}
                              >
                                Mexican
                              </Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <div className="flex border rounded-md border-blue-200">
                      <Button
                        variant={viewMode === "grid" ? "ghost" : "ghost"}
                        size="icon"
                        className={`rounded-none ${
                          viewMode === "grid" ? "bg-blue-100" : ""
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "ghost" : "ghost"}
                        size="icon"
                        className={`rounded-none ${
                          viewMode === "list" ? "bg-blue-100" : ""
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    <Button
                      variant={activeMealType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveMealType("all")}
                      className="whitespace-nowrap"
                    >
                      <Utensils className="h-4 w-4 mr-1" /> All
                    </Button>
                    <Button
                      variant={
                        activeMealType === "breakfast" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveMealType("breakfast")}
                      className="whitespace-nowrap"
                    >
                      <Coffee className="h-4 w-4 mr-1" /> Breakfast
                    </Button>
                    <Button
                      variant={
                        activeMealType === "lunch" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveMealType("lunch")}
                      className="whitespace-nowrap"
                    >
                      <Sun className="h-4 w-4 mr-1" /> Lunch
                    </Button>
                    <Button
                      variant={
                        activeMealType === "dinner" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveMealType("dinner")}
                      className="whitespace-nowrap"
                    >
                      <Moon className="h-4 w-4 mr-1" /> Dinner
                    </Button>
                    <Button
                      variant={
                        activeMealType === "snacks" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveMealType("snacks")}
                      className="whitespace-nowrap"
                    >
                      <Cookie className="h-4 w-4 mr-1" /> Snacks
                    </Button>
                  </div>

                  {/* Meal Cards */}
                  <div
                    className={`${
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
                        : "space-y-3"
                    } max-h-[calc(100vh-350px)] overflow-y-auto pr-1`}
                  >
                    {filteredMeals
                      .slice(0, showAllRecipes ? undefined : 6)
                      .map((meal, index) => (
                        <motion.div
                          key={meal.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="transition-all"
                        >
                          <Card className="overflow-hidden hover:shadow-md transition-shadow h-full border border-blue-100">
                            <div
                              className={
                                viewMode === "grid"
                                  ? "flex flex-col h-full"
                                  : "flex h-full"
                              }
                            >
                              <div
                                className={
                                  viewMode === "grid"
                                    ? "h-32 bg-muted flex items-center justify-center relative overflow-hidden"
                                    : "h-24 w-24 bg-muted flex items-center justify-center relative overflow-hidden"
                                }
                              >
                                <img
                                  src={meal.image || "/placeholder.svg"}
                                  alt={meal.name}
                                  className="w-full h-full object-cover absolute inset-0"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  {getMealTypeIcon(meal.category)}
                                </div>
                              </div>
                              <div className="p-3 flex-1 flex flex-col">
                                <div>
                                  <h3 className="font-medium text-sm line-clamp-1">
                                    {meal.name}
                                  </h3>
                                  {meal.cuisine && (
                                    <p className="text-xs text-muted-foreground">
                                      {meal.cuisine} Cuisine
                                    </p>
                                  )}
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {meal.tags.slice(0, 2).map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-auto pt-2">
                                  <div className="flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                    <Flame className="h-3 w-3 mr-1 text-orange-500" />
                                    {meal.calories} cal
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2"
                                      onClick={() => setSelectedMeal(meal)}
                                    >
                                      Details
                                    </Button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-7 px-2"
                                        >
                                          <Plus className="h-3 w-3 mr-1" />
                                          Add
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Add to Meal Plan
                                          </DialogTitle>
                                          <DialogDescription>
                                            Select a day and meal type to add
                                            this meal to your plan.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                          <div>
                                            <h4 className="mb-2 text-sm font-medium">
                                              Select Day
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                              {days.map((day) => (
                                                <Button
                                                  key={day}
                                                  variant={
                                                    selectedDay === day
                                                      ? "default"
                                                      : "outline"
                                                  }
                                                  size="sm"
                                                  onClick={() =>
                                                    setSelectedDay(day)
                                                  }
                                                >
                                                  {day}
                                                </Button>
                                              ))}
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="mb-2 text-sm font-medium">
                                              Select Meal
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                              {mealTypes.map((type) => (
                                                <Button
                                                  key={type}
                                                  variant={
                                                    selectedMealType === type
                                                      ? "default"
                                                      : "outline"
                                                  }
                                                  size="sm"
                                                  onClick={() =>
                                                    setSelectedMealType(type)
                                                  }
                                                >
                                                  {type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    type.slice(1)}
                                                </Button>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex justify-end">
                                          <Button
                                            disabled={
                                              !selectedDay || !selectedMealType
                                            }
                                            onClick={() => {
                                              if (
                                                selectedDay &&
                                                selectedMealType
                                              ) {
                                                addToMealPlan(
                                                  meal,
                                                  selectedDay,
                                                  selectedMealType
                                                );
                                                setSelectedDay(null);
                                                setSelectedMealType(null);
                                              }
                                            }}
                                          >
                                            Add to Plan
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                  </div>

                  {/* View More Button */}
                  {filteredMeals.length > 6 && !showAllRecipes && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAllRecipes(true)}
                        className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
                      >
                        View All Recipes
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Meal Plan */}
          <div className="lg:col-span-7 xl:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="h-5 w-5 mr-2 text-[#0284c7]" />
                    Weekly Meal Plan
                  </CardTitle>
                  <CardDescription>
                    Plan your meals for the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={days[0]} onValueChange={setActiveDay}>
                    <TabsList className="grid grid-cols-7">
                      {days.map((day) => (
                        <TabsTrigger
                          key={day}
                          value={day}
                          className="text-xs sm:text-sm"
                        >
                          {day.substring(0, 3)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {days.map((day) => (
                      <TabsContent key={day} value={day}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Daily Nutrition Summary */}
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:col-span-2"
                          >
                            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-sm">
                              <CardContent className="pt-6">
                                <h3 className="font-medium mb-4 flex items-center">
                                  <Flame className="h-5 w-5 mr-2 text-orange-500" />
                                  Daily Nutrition
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="bg-white rounded-lg shadow-sm p-4 border border-blue-100">
                                    <div className="flex justify-between items-center mb-2">
                                      <p className="text-sm font-medium text-gray-700">
                                        Calories
                                      </p>
                                      <div className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                        {calculateDailyNutrition(day).calories}{" "}
                                        / {nutritionGoals.calories}
                                      </div>
                                    </div>
                                    <Progress
                                      value={calculateNutritionPercentage(
                                        day,
                                        "calories"
                                      )}
                                      className={`h-2 ${getNutrientColor(
                                        calculateNutritionPercentage(
                                          day,
                                          "calories"
                                        )
                                      )}`}
                                    />
                                  </div>

                                  <div className="bg-white rounded-lg shadow-sm p-4 border border-blue-100">
                                    <div className="flex justify-between items-center mb-2">
                                      <p className="text-sm font-medium text-gray-700">
                                        Protein
                                      </p>
                                      <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                        {calculateDailyNutrition(day).protein}g
                                        / {nutritionGoals.protein}g
                                      </div>
                                    </div>
                                    <Progress
                                      value={calculateNutritionPercentage(
                                        day,
                                        "protein"
                                      )}
                                      className={`h-2 ${getNutrientColor(
                                        calculateNutritionPercentage(
                                          day,
                                          "protein"
                                        )
                                      )}`}
                                    />
                                  </div>

                                  <div className="bg-white rounded-lg shadow-sm p-4 border border-blue-100">
                                    <div className="flex justify-between items-center mb-2">
                                      <p className="text-sm font-medium text-gray-700">
                                        Carbs
                                      </p>
                                      <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                        {calculateDailyNutrition(day).carbs}g /{" "}
                                        {nutritionGoals.carbs}g
                                      </div>
                                    </div>
                                    <Progress
                                      value={calculateNutritionPercentage(
                                        day,
                                        "carbs"
                                      )}
                                      className={`h-2 ${getNutrientColor(
                                        calculateNutritionPercentage(
                                          day,
                                          "carbs"
                                        )
                                      )}`}
                                    />
                                  </div>

                                  <div className="bg-white rounded-lg shadow-sm p-4 border border-blue-100">
                                    <div className="flex justify-between items-center mb-2">
                                      <p className="text-sm font-medium text-gray-700">
                                        Fat
                                      </p>
                                      <div className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                        {calculateDailyNutrition(day).fat}g /{" "}
                                        {nutritionGoals.fat}g
                                      </div>
                                    </div>
                                    <Progress
                                      value={calculateNutritionPercentage(
                                        day,
                                        "fat"
                                      )}
                                      className={`h-2 ${getNutrientColor(
                                        calculateNutritionPercentage(day, "fat")
                                      )}`}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                          {/* Breakfast */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <Card className="border border-blue-100">
                              <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-orange-50">
                                <CardTitle className="text-base flex items-center">
                                  <Coffee className="h-4 w-4 mr-2 text-amber-600" />
                                  Breakfast
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {mealPlan[day].breakfast ? (
                                  <div className="relative">
                                    <div className="flex gap-4">
                                      <div className="h-16 w-16 bg-muted flex items-center justify-center rounded-md overflow-hidden">
                                        {mealPlan[day].breakfast.image ? (
                                          <img
                                            src={
                                              mealPlan[day].breakfast.image ||
                                              "/placeholder.svg"
                                            }
                                            alt={mealPlan[day].breakfast.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <Coffee className="h-6 w-6 text-amber-600/50" />
                                        )}
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-sm">
                                          {mealPlan[day].breakfast.name}
                                        </h3>
                                        <div className="flex items-center mt-1">
                                          <Flame className="h-3 w-3 mr-1 text-orange-500" />
                                          <p className="text-xs text-muted-foreground">
                                            {mealPlan[day].breakfast.calories}{" "}
                                            calories
                                          </p>
                                        </div>
                                        <div className="flex gap-1 mt-1">
                                          {mealPlan[day].breakfast.tags
                                            .slice(0, 1)
                                            .map((tag) => (
                                              <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {tag}
                                              </Badge>
                                            ))}
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0"
                                        onClick={() =>
                                          removeFromMealPlan(day, "breakfast")
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-16 border border-dashed rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      No breakfast planned
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>

                          {/* Lunch */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <Card className="border border-blue-100">
                              <CardHeader className="pb-2 bg-gradient-to-r from-yellow-50 to-amber-50">
                                <CardTitle className="text-base flex items-center">
                                  <Sun className="h-4 w-4 mr-2 text-yellow-500" />
                                  Lunch
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {mealPlan[day].lunch ? (
                                  <div className="relative">
                                    <div className="flex gap-4">
                                      <div className="h-16 w-16 bg-muted flex items-center justify-center rounded-md overflow-hidden">
                                        {mealPlan[day].lunch.image ? (
                                          <img
                                            src={
                                              mealPlan[day].lunch.image ||
                                              "/placeholder.svg"
                                            }
                                            alt={mealPlan[day].lunch.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <Sun className="h-6 w-6 text-yellow-500/50" />
                                        )}
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-sm">
                                          {mealPlan[day].lunch.name}
                                        </h3>
                                        <div className="flex items-center mt-1">
                                          <Flame className="h-3 w-3 mr-1 text-orange-500" />
                                          <p className="text-xs text-muted-foreground">
                                            {mealPlan[day].lunch.calories}{" "}
                                            calories
                                          </p>
                                        </div>
                                        <div className="flex gap-1 mt-1">
                                          {mealPlan[day].lunch.tags
                                            .slice(0, 1)
                                            .map((tag) => (
                                              <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {tag}
                                              </Badge>
                                            ))}
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0"
                                        onClick={() =>
                                          removeFromMealPlan(day, "lunch")
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-16 border border-dashed rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      No lunch planned
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>

                          {/* Dinner */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <Card className="border border-blue-100">
                              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <CardTitle className="text-base flex items-center">
                                  <Moon className="h-4 w-4 mr-2 text-blue-700" />
                                  Dinner
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {mealPlan[day].dinner ? (
                                  <div className="relative">
                                    <div className="flex gap-4">
                                      <div className="h-16 w-16 bg-muted flex items-center justify-center rounded-md overflow-hidden">
                                        {mealPlan[day].dinner.image ? (
                                          <img
                                            src={
                                              mealPlan[day].dinner.image ||
                                              "/placeholder.svg"
                                            }
                                            alt={mealPlan[day].dinner.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <Moon className="h-6 w-6 text-blue-700/50" />
                                        )}
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-sm">
                                          {mealPlan[day].dinner.name}
                                        </h3>
                                        <div className="flex items-center mt-1">
                                          <Flame className="h-3 w-3 mr-1 text-orange-500" />
                                          <p className="text-xs text-muted-foreground">
                                            {mealPlan[day].dinner.calories}{" "}
                                            calories
                                          </p>
                                        </div>
                                        <div className="flex gap-1 mt-1">
                                          {mealPlan[day].dinner.tags
                                            .slice(0, 1)
                                            .map((tag) => (
                                              <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {tag}
                                              </Badge>
                                            ))}
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0"
                                        onClick={() =>
                                          removeFromMealPlan(day, "dinner")
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-16 border border-dashed rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      No dinner planned
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>

                          {/* Snacks */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <Card className="border border-blue-100">
                              <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-yellow-50">
                                <CardTitle className="text-base flex items-center">
                                  <Cookie className="h-4 w-4 mr-2 text-amber-400" />
                                  Snacks
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {mealPlan[day].snacks.length > 0 ? (
                                  <div className="space-y-2">
                                    {mealPlan[day].snacks.map(
                                      (snack, index) => (
                                        <div key={index} className="relative">
                                          <div className="flex gap-4">
                                            <div className="h-12 w-12 bg-muted flex items-center justify-center rounded-md overflow-hidden">
                                              {snack.image ? (
                                                <img
                                                  src={
                                                    snack.image ||
                                                    "/placeholder.svg"
                                                  }
                                                  alt={snack.name}
                                                  className="w-full h-full object-cover"
                                                />
                                              ) : (
                                                <Cookie className="h-5 w-5 text-amber-400/50" />
                                              )}
                                            </div>
                                            <div>
                                              <h3 className="font-medium text-xs">
                                                {snack.name}
                                              </h3>
                                              <div className="flex items-center">
                                                <Flame className="h-3 w-3 mr-1 text-orange-500" />
                                                <p className="text-xs text-muted-foreground">
                                                  {snack.calories} calories
                                                </p>
                                              </div>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="absolute top-0 right-0 h-6 w-6"
                                              onClick={() =>
                                                removeFromMealPlan(
                                                  day,
                                                  "snacks",
                                                  index
                                                )
                                              }
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-16 border border-dashed rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      No snacks planned
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-blue-50 to-cyan-50 border-t">
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md"
                    onClick={saveMealPlan}
                    disabled={savingPlan}
                  >
                    {isAuthenticated ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {savingPlan ? "Saving..." : "Save Meal Plan"}
                      </>
                    ) : (
                      "Sign In to Save"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Educational Content in Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4"
            >
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                  <CardTitle className="text-lg flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    Nutrition & Meal Planning Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="nutrition-tips">
                      <AccordionTrigger>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-red-500" />
                          <span>Nutrition Tips</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {nutritionTips.slice(0, 4).map((tip) => (
                            <Card
                              key={tip.id}
                              className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100"
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  {tip.icon}
                                  <div>
                                    <h4 className="text-sm font-medium">
                                      {tip.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {tip.content}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="meal-planning">
                      <AccordionTrigger>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-violet-500" />
                          <span>Meal Planning 101</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-3 rounded-lg border border-violet-100">
                            <h3 className="font-medium flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                              Why Plan Your Meals?
                            </h3>
                            <ul className="mt-2 space-y-1 text-xs">
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-0.5" />
                                <span>
                                  Save money by reducing food waste and impulse
                                  purchases
                                </span>
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-0.5" />
                                <span>
                                  Save time by shopping efficiently and reducing
                                  daily decisions
                                </span>
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-0.5" />
                                <span>
                                  Eat healthier by making intentional food
                                  choices
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                            <h3 className="font-medium flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                              Getting Started
                            </h3>
                            <ul className="mt-2 space-y-1 text-xs">
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-0.5" />
                                <span>
                                  Start with planning just 3-4 days at a time
                                </span>
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-0.5" />
                                <span>
                                  Consider your schedule - plan simpler meals
                                  for busy days
                                </span>
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-0.5" />
                                <span>
                                  Plan to use leftovers creatively to reduce
                                  cooking time
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="indian-cuisine">
                      <AccordionTrigger>
                        <span className="flex items-center">
                          <Flame className="h-4 w-4 mr-2 text-red-600" />
                          <span>Indian Cuisine Benefits</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
                            <h3 className="font-medium flex items-center text-sm">
                              <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                              Health Benefits of Indian Spices
                            </h3>
                            <ul className="mt-2 space-y-1 text-xs">
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-0.5" />
                                <span>
                                  <strong>Turmeric:</strong> Contains curcumin
                                  with powerful anti-inflammatory properties
                                </span>
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-0.5" />
                                <span>
                                  <strong>Cumin:</strong> Aids digestion and is
                                  rich in iron
                                </span>
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-0.5" />
                                <span>
                                  <strong>Coriander:</strong> Contains
                                  antioxidants and helps lower blood sugar
                                </span>
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-0.5" />
                                <span>
                                  <strong>Ginger:</strong> Reduces nausea and
                                  fights infections
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-3 rounded-lg border border-green-100">
                            <h3 className="font-medium flex items-center text-sm">
                              <Leaf className="h-4 w-4 mr-2 text-green-500" />
                              Balanced Indian Meals
                            </h3>
                            <p className="mt-2 text-xs">
                              Traditional Indian meals often follow the
                              principle of balance with a variety of flavors
                              (sweet, sour, salty, bitter, pungent, astringent)
                              and include proteins (lentils, yogurt), complex
                              carbs (rice, roti), and vegetables in a single
                              meal.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-6 py-4 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © 2023 Meal Planner. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm">
                Terms of Service
              </Button>
              <Button variant="ghost" size="sm">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <Dialog
          open={!!selectedMeal}
          onOpenChange={() => setSelectedMeal(null)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedMeal.name}</DialogTitle>
              {selectedMeal.cuisine && (
                <DialogDescription>
                  {selectedMeal.cuisine} Cuisine
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="h-48 bg-muted flex items-center justify-center rounded-lg overflow-hidden">
                  {selectedMeal.image ? (
                    <img
                      src={selectedMeal.image || "/placeholder.svg"}
                      alt={selectedMeal.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getMealTypeIcon(selectedMeal.category)
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">
                    Nutrition Facts (per serving)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-2 rounded-md border border-orange-100">
                      <p className="text-sm font-medium">Calories</p>
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 mr-1 text-orange-500" />
                        <p>{selectedMeal.calories}</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-2 rounded-md border border-blue-100">
                      <p className="text-sm font-medium">Protein</p>
                      <p>{selectedMeal.protein}g</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-md border border-green-100">
                      <p className="text-sm font-medium">Carbs</p>
                      <p>{selectedMeal.carbs}g</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-2 rounded-md border border-yellow-100">
                      <p className="text-sm font-medium">Fat</p>
                      <p>{selectedMeal.fat}g</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedMeal.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedMeal.description}
                </p>

                <h3 className="font-medium mb-2">Ingredients</h3>
                <ul className="space-y-1 mb-4">
                  {selectedMeal.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <ChevronRight className="h-3 w-3 mr-1 text-primary shrink-0 mt-1" />
                      {ingredient}
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Preparation Time</h3>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedMeal.preparationTime} minutes
                  </p>
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md"
                    onClick={() => {
                      setSelectedDay(days[0]);
                      setSelectedMealType(selectedMeal.category);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Meal Plan
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* View All Recipes Modal */}
      <Dialog
        open={showAllRecipes}
        onOpenChange={(open) => setShowAllRecipes(open)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Recipes</DialogTitle>
            <DialogDescription>
              Browse our complete collection of recipes
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={activeMealType} onValueChange={setActiveMealType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Meal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {mealTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={activeCuisine} onValueChange={setActiveCuisine}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  <SelectItem value="Indian">Indian</SelectItem>
                  <SelectItem value="Western">Western</SelectItem>
                  <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="Mexican">Mexican</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMeals.map((meal) => (
                <Card
                  key={meal.id}
                  className="overflow-hidden border border-blue-100"
                >
                  <div className="flex flex-col h-full">
                    <div className="h-32 bg-muted flex items-center justify-center relative overflow-hidden">
                      <img
                        src={meal.image || "/placeholder.svg"}
                        alt={meal.name}
                        className="w-full h-full object-cover absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        {getMealTypeIcon(meal.category)}
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <div>
                        <h3 className="font-medium text-sm">{meal.name}</h3>
                        {meal.cuisine && (
                          <p className="text-xs text-muted-foreground">
                            {meal.cuisine} Cuisine
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {meal.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-auto pt-2">
                        <div className="flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          <Flame className="h-3 w-3 mr-1 text-orange-500" />
                          {meal.calories} cal
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => {
                              setSelectedMeal(meal);
                              setShowAllRecipes(false);
                            }}
                          >
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => {
                              setSelectedDay(days[0]);
                              setSelectedMealType(meal.category);
                              setShowAllRecipes(false);
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminders Sheet */}
      <Sheet open={showReminders} onOpenChange={setShowReminders}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-orange-500" />
              Meal Reminders
            </SheetTitle>
            <SheetDescription>
              Set reminders for your meals throughout the week
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Add New Reminder</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="reminder-day">Day</Label>
                    <Select
                      value={newReminder.day}
                      onValueChange={(value) =>
                        setNewReminder({ ...newReminder, day: value })
                      }
                    >
                      <SelectTrigger id="reminder-day">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reminder-meal">Meal</Label>
                    <Select
                      value={newReminder.mealType}
                      onValueChange={(value) =>
                        setNewReminder({ ...newReminder, mealType: value })
                      }
                    >
                      <SelectTrigger id="reminder-meal">
                        <SelectValue placeholder="Select meal" />
                      </SelectTrigger>
                      <SelectContent>
                        {mealTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reminder-time">Time</Label>
                  <Input
                    id="reminder-time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, time: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reminder-enabled"
                      checked={newReminder.enabled}
                      onCheckedChange={(checked) =>
                        setNewReminder({
                          ...newReminder,
                          enabled: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="reminder-enabled">Enable reminder</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reminder-email"
                      checked={newReminder.notifyByEmail}
                      onCheckedChange={(checked) =>
                        setNewReminder({
                          ...newReminder,
                          notifyByEmail: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="reminder-email">Notify by email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reminder-push"
                      checked={newReminder.notifyByPush}
                      onCheckedChange={(checked) =>
                        setNewReminder({
                          ...newReminder,
                          notifyByPush: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="reminder-push">
                      Send push notification
                    </Label>
                  </div>
                </div>
              </div>
              <Button
                onClick={addReminder}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md"
              >
                <Bell className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Your Reminders</h3>
              {reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    You don't have any reminders yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {reminders.map((reminder) => (
                    <Card key={reminder.id} className="border border-blue-100">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">
                              {reminder.day} -{" "}
                              {reminder.mealType.charAt(0).toUpperCase() +
                                reminder.mealType.slice(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {reminder.time}
                            </p>
                            <div className="flex gap-2 mt-1">
                              {reminder.notifyByEmail && (
                                <Badge variant="outline" className="text-xs">
                                  Email
                                </Badge>
                              )}
                              {reminder.notifyByPush && (
                                <Badge variant="outline" className="text-xs">
                                  Push
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={reminder.enabled}
                              onCheckedChange={() =>
                                toggleReminder(reminder.id)
                              }
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={() => deleteReminder(reminder.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          <SheetFooter className="mt-4">
            <Button
              variant="outline"
              onClick={requestNotificationPermission}
              className="w-full"
            >
              Enable Browser Notifications
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Settings Sheet */}
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-700" />
              Settings
            </SheetTitle>
            <SheetDescription>
              Customize your meal planning experience
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Nutrition Goals</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="calories-goal">Daily Calories</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="calories-goal"
                      type="number"
                      value={nutritionGoals.calories}
                      onChange={(e) =>
                        setNutritionGoals({
                          ...nutritionGoals,
                          calories: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">cal</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="protein-goal">Daily Protein</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="protein-goal"
                      type="number"
                      value={nutritionGoals.protein}
                      onChange={(e) =>
                        setNutritionGoals({
                          ...nutritionGoals,
                          protein: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">g</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="carbs-goal">Daily Carbs</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="carbs-goal"
                      type="number"
                      value={nutritionGoals.carbs}
                      onChange={(e) =>
                        setNutritionGoals({
                          ...nutritionGoals,
                          carbs: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">g</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fat-goal">Daily Fat</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="fat-goal"
                      type="number"
                      value={nutritionGoals.fat}
                      onChange={(e) =>
                        setNutritionGoals({
                          ...nutritionGoals,
                          fat: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">g</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="browser-notifications">
                    Browser Notifications
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestNotificationPermission}
                  >
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <Switch id="email-notifications" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Custom Animations</h3>
              <div className="space-y-2">
                <Label htmlFor="lottie-url">
                  Add Custom Lottie Animation URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="lottie-url"
                    placeholder="https://lottie.host/your-animation.json"
                    value={customLottieUrl}
                    onChange={(e) => setCustomLottieUrl(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowLottieUploader(true)}
                  >
                    Preview
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add your own Lottie animations from lottie.host or other
                  sources
                </p>
              </div>
            </div>
          </div>
          <SheetFooter className="mt-4">
            <Button
              onClick={() => {
                saveMealPlan();
                setShowSettings(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md"
            >
              Save Settings
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Lottie Preview Dialog */}
      <Dialog open={showLottieUploader} onOpenChange={setShowLottieUploader}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lottie Animation Preview</DialogTitle>
            <DialogDescription>
              Preview your custom Lottie animation
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLottieUploader(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!customLottieUrl}
              onClick={() => {
                toast({
                  title: "Animation saved",
                  description: "Your custom animation has been saved",
                  variant: "success",
                });
                setShowLottieUploader(false);
              }}
            >
              Use Animation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Permission Dialog */}
      <Dialog
        open={showNotificationPermission}
        onOpenChange={setShowNotificationPermission}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Notifications</DialogTitle>
            <DialogDescription>
              Allow notifications to receive meal reminders even when you're not
              using the app
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <Bell className="h-16 w-16 text-blue-500" />{" "}
              {/* Replaced with a simple bell icon */}
            </div>
            <p className="text-sm text-center text-muted-foreground">
              You'll receive timely notifications for your meal reminders,
              helping you stay on track with your meal plan.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNotificationPermission(false)}
            >
              Not Now
            </Button>
            <Button
              onClick={() => {
                requestNotificationPermission();
                setShowNotificationPermission(false);
              }}
            >
              Enable Notifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
