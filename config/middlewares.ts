import { getAllTours } from '@/lib/strapi'

export default async function TestStrapi() {
  const tours = await getAllTours('en')
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Strapi Connection Test</h1>
      <p className="mb-4">Tours found: {tours.length}</p>
      
      {tours.length > 0 ? (
        <div className="space-y-4">
          {tours.slice(0, 3).map((tour: any) => (
            <div key={tour.id} className="border p-4 rounded">
              <h3 className="font-bold">{tour.title}</h3>
              <p className="text-sm text-gray-600">{tour.slug}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tours yet. Add some in Strapi admin!</p>
      )}
    </div>
  )
}
