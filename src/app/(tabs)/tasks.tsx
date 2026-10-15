import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, EmptyState, Field, Heading, Pill, Screen } from '@/components/planner-ui';
import { usePlanner } from '@/lib/store';
import { usePalette, useAccent } from '@/lib/theme';
import { SUBJECTS, type Priority, type TaskStatus } from '@/lib/types';

const statuses: ('Todas' | TaskStatus)[] = ['Todas', 'Pendiente', 'En progreso', 'Completada'];
export default function TasksScreen() {
  const c = usePalette(); const accent = useAccent(); const { tasks } = usePlanner();
  const [query, setQuery] = useState(''); const [status, setStatus] = useState<'Todas' | TaskStatus>('Todas'); const [subject, setSubject] = useState('Todas'); const [priority, setPriority] = useState<'Todas' | Priority>('Todas');
  const filtered = useMemo(() => tasks.filter((task) => (status === 'Todas' || task.status === status) && (subject === 'Todas' || task.subject === subject) && (priority === 'Todas' || task.priority === priority) && `${task.title} ${task.subject}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))).sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [tasks, query, status, subject, priority]);
  return <Screen>
    <Heading title="Mis tareas" subtitle={`${tasks.length} en total`} right={<Link href="/task/new" asChild><Pressable style={{ backgroundColor: accent, borderRadius: 14, paddingHorizontal: 15, paddingVertical: 11 }}><Text style={{ color: '#fff', fontWeight: '800' }}>＋ Nueva</Text></Pressable></Link>} />
    <Field label="Buscar" value={query} onChangeText={setQuery} placeholder="Busca por nombre o materia…" />
    <Text style={{ color: c.text, fontWeight: '700' }}>Estado</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>{statuses.map((value) => <Pill key={value} label={value} selected={status === value} onPress={() => setStatus(value)} />)}</View>
    <Text style={{ color: c.text, fontWeight: '700' }}>Materia</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}><Pill label="Todas" selected={subject === 'Todas'} onPress={() => setSubject('Todas')} />{SUBJECTS.map((value) => <Pill key={value} label={value} selected={subject === value} onPress={() => setSubject(subject === value ? 'Todas' : value)} />)}</View>
    <Text style={{ color: c.text, fontWeight: '700' }}>Prioridad</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}><Pill label="Todas" selected={priority === 'Todas'} onPress={() => setPriority('Todas')} />{(['Alta', 'Media', 'Baja'] as Priority[]).map((value) => <Pill key={value} label={value} selected={priority === value} onPress={() => setPriority(priority === value ? 'Todas' : value)} />)}</View>
    <Heading title="Lista" subtitle={filtered.length ? 'Ordenadas por fecha de entrega' : undefined} />
    {filtered.length ? filtered.map((task) => <Link key={task.id} href={{ pathname: '/task/[id]', params: { id: task.id } }} asChild><Pressable><Card style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16 }}><View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: task.priority === 'Alta' ? c.orangeSoft : c.greenSoft, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 17 }}>{task.status === 'Completada' ? '✓' : task.priority === 'Alta' ? '!' : '✎'}</Text></View><View style={{ flex: 1 }}><Text style={{ color: c.text, fontSize: 15, fontWeight: '700' }}>{task.title}</Text><Text style={{ color: c.muted, fontSize: 12, marginTop: 5 }}>{task.subject} · Entrega {task.dueDate}</Text></View><Text style={{ color: task.status === 'Completada' ? accent : c.orange, fontSize: 11, fontWeight: '700' }}>{task.status}</Text></Card></Pressable></Link>) : <EmptyState title="No encontramos tareas" subtitle="Prueba con otra búsqueda o cambia los filtros." />}
  </Screen>;
}
