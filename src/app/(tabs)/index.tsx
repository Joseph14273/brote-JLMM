import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, EmptyState, Field, Heading, Screen } from '@/components/planner-ui';
import { usePlanner } from '@/lib/store';
import { useAccent, useAccentSoft, usePalette } from '@/lib/theme';
import { DAYS } from '@/lib/types';

export default function HomeScreen() {
  const c = usePalette(); const accent = useAccent(); const accentSoft = useAccentSoft();
  const { tasks, classes, settings, updateSettings, storageError, recoverStorage } = usePlanner();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const pending = useMemo(() => tasks.filter((t) => t.status !== 'Completada').sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3), [tasks]);
  const completedCount = tasks.filter((task) => task.status === 'Completada').length;
  const progress = tasks.length ? completedCount / tasks.length : 0;
  const today = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const todayIndex = (new Date().getDay() + 6) % 7;
  const currentTime = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
  const upcoming = Array.from({ length: 7 }, (_, offset) => {
    const day = DAYS[(todayIndex + offset) % DAYS.length];
    return classes.filter((item) => item.day === day && (offset > 0 || item.endTime > currentTime)).sort((a, b) => a.startTime.localeCompare(b.startTime))[0];
  }).find(Boolean);
  const nextClassLabel = upcoming ? (upcoming.day === DAYS[todayIndex] ? 'Hoy' : upcoming.day) : '';
  return <Screen>
    <Heading title="Brote-JLMM" subtitle={today.charAt(0).toLocaleUpperCase('es-CO') + today.slice(1)} />
    <Card style={{ overflow: 'hidden', backgroundColor: accentSoft, borderColor: 'transparent', padding: 0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 160 }}>
        <View style={{ flex: 1, padding: 18, gap: 8 }}>
          <Text style={{ color: c.text, fontSize: 20, fontWeight: '800', lineHeight: 27 }}>{settings.name ? `¡Hola, ${settings.name}!` : '¡Hola, estudiante!'}</Text>
          <Text style={{ color: c.muted, fontSize: 13, lineHeight: 19 }}>{pending.length ? `Tienes ${tasks.filter((t) => t.status !== 'Completada').length} tareas por delante. ¡Un paso a la vez!` : 'Un nuevo día para aprender algo bonito.'}</Text>
          {!settings.name ? <View style={{ gap: 8 }}><Field label="¿Cómo te llamas?" value={name} onChangeText={(value) => { setName(value); setNameError(false); }} placeholder="Tu nombre" autoCapitalize="words" style={{ paddingVertical: 9, minWidth: 155 }} />{nameError ? <Text accessibilityRole="alert" style={{ color: c.orange, fontSize: 12 }}>Escribe tu nombre para continuar.</Text> : null}<Pressable accessibilityRole="button" onPress={() => { if (!name.trim()) { setNameError(true); return; } updateSettings({ ...settings, name: name.trim() }); }} style={{ backgroundColor: accent, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 10, alignSelf: 'flex-start' }}><Text style={{ color: '#fff', fontWeight: '700' }}>Guardar mi nombre</Text></Pressable></View> : null}
        </View>
        <Image source={require('../../../assets/images/mascot-wave.png')} contentFit="contain" style={{ width: 142, height: 148, marginRight: 2, alignSelf: 'flex-end' }} accessibilityLabel="Brote, tu compañero de estudio" />
      </View>
    </Card>
    {storageError ? <Card style={{ padding: 12, gap: 8 }}><Text style={{ color: c.orange, fontSize: 12 }}>No se pudo leer o guardar la información local. Tus datos actuales siguen disponibles en esta sesión.</Text><Pressable onPress={recoverStorage} style={{ alignSelf: 'flex-start', paddingVertical: 6 }}><Text style={{ color: c.text, fontWeight: '700' }}>Reintentar guardado local</Text></Pressable></Card> : null}
    <Heading title="Tu día" subtitle="Pequeños pasos, grandes logros." />
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Card style={{ flex: 1, padding: 14 }}><Text style={{ color: accent, fontWeight: '800', fontSize: 24 }}>{tasks.filter((t) => t.status !== 'Completada').length}</Text><Text style={{ color: c.muted, fontSize: 12 }}>por completar</Text></Card>
      <Card style={{ flex: 1, padding: 14 }}><Text style={{ color: c.orange, fontWeight: '800', fontSize: 24 }}>{tasks.filter((t) => t.status === 'Completada').length}</Text><Text style={{ color: c.muted, fontSize: 12 }}>completadas</Text></Card>
    </View>
    <Card style={{ padding: 15, gap: 9 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: c.text, fontWeight: '700' }}>Tu progreso</Text><Text style={{ color: c.muted, fontSize: 12 }}>{completedCount} de {tasks.length} tareas</Text></View><View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: tasks.length, now: completedCount }} style={{ height: 8, borderRadius: 8, backgroundColor: c.line, overflow: 'hidden' }}><View style={{ width: `${progress * 100}%`, height: 8, backgroundColor: accent, borderRadius: 8 }} /></View></Card>
    <Heading title="Lo que sigue" right={<Link href="/(tabs)/tasks" asChild><Pressable><Text style={{ color: accent, fontWeight: '700' }}>Ver todo →</Text></Pressable></Link>} />
    {pending.length ? pending.map((task) => <Link key={task.id} href={{ pathname: '/task/[id]', params: { id: task.id } }} asChild><Pressable><Card style={{ padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 }}><View style={{ width: 9, height: 40, backgroundColor: task.priority === 'Alta' ? c.red : task.priority === 'Media' ? c.orange : accent, borderRadius: 9 }} /><View style={{ flex: 1 }}><Text style={{ color: c.text, fontWeight: '700' }}>{task.title}</Text><Text style={{ color: c.muted, marginTop: 4, fontSize: 12 }}>{task.subject} · {task.dueDate}</Text></View><Text style={{ color: c.muted }}>›</Text></Card></Pressable></Link>) : tasks.length > 0 ? <Card style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: accentSoft, borderColor: 'transparent' }}><Image source={require('../../../assets/images/mascot-celebrate.png')} contentFit="contain" style={{ width: 90, height: 90 }} accessibilityLabel="Brote celebra tus logros" /><View style={{ flex: 1 }}><Text style={{ color: c.text, fontWeight: '800', fontSize: 17 }}>¡Lo lograste!</Text><Text style={{ color: c.muted, fontSize: 13, marginTop: 5 }}>Completaste todas tus tareas.</Text></View></Card> : <EmptyState title="Todo al día" subtitle="Aún no tienes tareas. ¡Puedes crear la primera!" />}
    <Card style={{ padding: 17, backgroundColor: c.orangeSoft, borderColor: 'transparent' }}><Text style={{ color: c.text, fontWeight: '800', fontSize: 16 }}>Próxima clase{upcoming ? ` · ${nextClassLabel}` : ''}</Text><Text style={{ color: c.muted, marginTop: 7 }}>{upcoming ? `${upcoming.subject} · ${upcoming.startTime} · ${upcoming.room || 'Aula por definir'}` : 'Revisa tu horario y organiza tu semana.'}</Text><Link href="/(tabs)/schedule" asChild><Pressable style={{ marginTop: 10 }}><Text style={{ color: c.orange, fontWeight: '700' }}>Ver horario →</Text></Pressable></Link></Card>
  </Screen>;
}
