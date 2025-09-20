"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAt,
  endAt,
  getCountFromServer,
} from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Users, Search, Clock, ChevronDown, ChevronUp } from "lucide-react";

type UserRecord = {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  lastLogin?: string;
  createdAt?: string;
};

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Array<UserRecord & { id: string }>>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [recentSignups, setRecentSignups] = useState<
    Array<UserRecord & { id: string }>
  >([]);
  const [totalPatients, setTotalPatients] = useState<number | null>(null);

  // Realtime patients listener
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "users"),
      where("role", "==", "patient"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Array<UserRecord & { id: string }> = [];
        snap.forEach((d) =>
          list.push({ id: d.id, ...(d.data() as UserRecord) })
        );
        setPatients(list);
        setLoading(false);
      },
      (err) => {
        console.error("Realtime patients listener error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Recent signups (limit 5)
  useEffect(() => {
    const rq = query(
      collection(db, "users"),
      where("role", "==", "patient"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const unsub = onSnapshot(rq, (snap) => {
      const list: Array<UserRecord & { id: string }> = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as UserRecord) }));
      setRecentSignups(list);
    });

    return () => unsub();
  }, []);

  // Total count (firestore count aggregation)
  useEffect(() => {
    (async () => {
      try {
        const colRef = collection(db, "users");
        const q = query(colRef, where("role", "==", "patient"));
        const snap = await getCountFromServer(q);
        setTotalPatients(snap.data().count);
      } catch (err) {
        console.warn("Count aggregation failed", err);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return patients;
    const s = search.toLowerCase();
    return patients.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(s) ||
        (p.email || "").toLowerCase().includes(s) ||
        (p.phone || "").includes(s)
    );
  }, [patients, search]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <p className="text-sm text-slate-600">
            Realtime patient list and recent activity
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-500">Total patients</div>
            <div className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" /> {totalPatients ?? "—"}
            </div>
          </div>
          <Link href="/" className="text-sm text-primary underline">
            Home
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Patients</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search by name, email or phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <Button variant="ghost">Refresh</Button>
              </div>
            </div>

            {loading ? (
              <div className="py-8">
                <Progress value={60} className="h-2" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                No patients found.
              </div>
            ) : (
              <ul className="space-y-3">
                {filtered.map((p) => (
                  <li key={p.id} className="p-3 border rounded">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{p.name || "—"}</div>
                        <div className="text-sm text-slate-600">{p.email}</div>
                        <div className="text-sm text-slate-500">
                          Phone: {p.phone || "—"}
                        </div>
                      </div>
                      <div className="flex items-start flex-col gap-2">
                        <div className="text-xs text-gray-500">
                          Joined:{" "}
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleString()
                            : "—"}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setExpanded((s) => ({ ...s, [p.id]: !s[p.id] }))
                            }
                          >
                            {expanded[p.id] ? (
                              <>
                                <ChevronUp className="h-4 w-4" /> Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" /> Details
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {expanded[p.id] && (
                      <div className="mt-3 border-t pt-3 text-sm text-slate-700">
                        <div>
                          <strong>Email:</strong> {p.email}
                        </div>
                        <div>
                          <strong>Phone:</strong> {p.phone || "—"}
                        </div>
                        <div>
                          <strong>Last Login:</strong>{" "}
                          {p.lastLogin
                            ? new Date(p.lastLogin).toLocaleString()
                            : "—"}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm">Message</Button>
                          <Button size="sm" variant="outline">
                            View History
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">Recent Signups</h3>
            <ul className="space-y-2">
              {recentSignups.map((r) => (
                <li key={r.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{r.name || r.email}</div>
                    <div className="text-xs text-slate-500">{r.email}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside>
          <Card className="p-4 sticky top-6">
            <h3 className="font-semibold mb-2">Activity</h3>
            <div className="text-sm text-slate-600 mb-3">
              Realtime updates show when patients sign up or update their
              profile.
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>Last update: live</div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-400" />
                <div>{totalPatients ?? "—"} total patients</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 mt-4">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Button>Invite Patient</Button>
              <Button variant="outline">Export CSV</Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
