import { PlaysGrid } from '../components/plays/PlaysGrid'

export function Library() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold text-white">Plays Library</h1>
      <PlaysGrid />
    </div>
  )
}
