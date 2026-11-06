import { useEffect, useRef } from 'react'
import { BottomNav } from './components/BottomNav'
import { EmptyState } from './components/EmptyState'
import { Button } from './components/Button'
import { setLang, useT } from './i18n'
import { navigate, paths, useRoute } from './router'
import { useSettings } from './state/store'
import CanMakeScreen from './screens/CanMakeScreen'
import DrinkScreen from './screens/DrinkScreen'
import FavoritesScreen from './screens/FavoritesScreen'
import PantryScreen from './screens/PantryScreen'
import SearchScreen from './screens/SearchScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  const t = useT()
  const route = useRoute()
  const { lang } = useSettings()
  const scroller = useRef<HTMLElement>(null)

  useEffect(() => { setLang(lang) }, [lang])
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }) }, [route.name, route.params.id])

  let screen
  switch (route.name) {
    case 'favorites': screen = <FavoritesScreen />; break
    case 'pantry': screen = <PantryScreen />; break
    case 'can-make': screen = <CanMakeScreen />; break
    case 'settings': screen = <SettingsScreen />; break
    case 'drink': screen = <DrinkScreen />; break
    case 'not-found':
      screen = <EmptyState title={t.drink.notFound} action={<Button variant="primary" size="lg" onClick={() => navigate(paths.search)}>{t.drink.backToSearch}</Button>} />
      break
    default: screen = <SearchScreen />
  }

  return (
    <div className="flex h-dvh justify-center bg-[#070605]">
      <div className="relative flex h-full w-full max-w-[480px] flex-col bg-bg md:border-x md:border-line">
        <main ref={scroller} className="scroll-area min-h-0 flex-1" style={{ paddingTop: 'var(--sat)' }}>
          {screen}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
