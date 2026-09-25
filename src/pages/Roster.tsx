import { PlayerForm } from '../components/roster/PlayerForm'
import { PlayerList } from '../components/roster/PlayerList'

export function Roster() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold text-white">Roster</h1>
      <PlayerForm />
      <PlayerList />
    </div>
  )
}
