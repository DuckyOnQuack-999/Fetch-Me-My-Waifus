import React, { useState } from 'react'
import { Collections, WaifuImage } from '../types/waifu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Folder, Plus, Trash2, ImageIcon } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'

interface CollectionsTabProps {
  collections: Collections
  onCreateCollection: (name: string) => void
  onDeleteCollection: (id: string) => void
  onAddToCollection: (collectionId: string, imageId: string) => void
  onRemoveFromCollection: (collectionId: string, imageId: string) => void
  images: WaifuImage[]
}

function SortableImage({ image, index }: { image: WaifuImage; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.image_id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Image
        src={image.preview_url}
        alt={image.tags.map(t => t.name).join(', ')}
        width={100}
        height={100}
        className="object-cover rounded-lg"
      />
    </div>
  )
}

export const CollectionsTab: React.FC<CollectionsTabProps> = ({
  collections,
  onCreateCollection,
  onDeleteCollection,
  onAddToCollection,
  onRemoveFromCollection,
  images,
}) => {
  const [newCollectionName, setNewCollectionName] = useState('')
  const [activeCollection, setActiveCollection] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim())
      setNewCollectionName('')
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const activeCollection = Object.values(collections).find(
        collection => collection.imageIds.includes(active.id)
      )
      const overCollection = Object.values(collections).find(
        collection => collection.id === over.id
      )

      if (activeCollection && overCollection) {
        onRemoveFromCollection(activeCollection.id, active.id)
        onAddToCollection(overCollection.id, active.id)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="New collection name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
        />
        <Button onClick={handleCreateCollection}>
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(collections).map((collection) => (
            <Card key={collection.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {collection.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteCollection(collection.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collection.imageIds.length}</div>
                <p className="text-xs text-muted-foreground">
                  Images in collection
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <SortableContext items={collection.imageIds} strategy={verticalListSortingStrategy}>
                    {collection.imageIds.slice(0, 9).map((imageId, index) => {
                      const image = images.find(img => String(img.image_id) === imageId)
                      return image ? (
                        <SortableImage key={imageId} image={image} index={index} />
                      ) : null
                    })}
                  </SortableContext>
                </div>
                {collection.imageIds.length > 9 && (
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    +{collection.imageIds.length - 9} more
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DndContext>
    </div>
  )
}
