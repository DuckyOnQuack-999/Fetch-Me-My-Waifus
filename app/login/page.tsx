'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useSettings } from '@/context/settingsContext'

export default function LoginPage() {
  const [waifuImApiKey, setWaifuImApiKey] = useState('')
  const [waifuPicsApiKey, setWaifuPicsApiKey] = useState('')
  const [nekosBestApiKey, setNekosBestApiKey] = useState('')
  const router = useRouter()
  const { updateSettings } = useSettings()

  const handleLogin = () => {
    updateSettings({
      waifuImApiKey,
      waifuPicsApiKey,
      nekosBestApiKey
    })
    router.push('/')
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Login to Waifu Downloader</CardTitle>
        <CardDescription>Enter your API keys for each source</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="waifu-im-key">Waifu.im API Key</Label>
          <Input
            id="waifu-im-key"
            type="password"
            value={waifuImApiKey}
            onChange={(e) => setWaifuImApiKey(e.target.value)}
            placeholder="Enter Waifu.im API Key"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="waifu-pics-key">Waifu Pics API Key</Label>
          <Input
            id="waifu-pics-key"
            type="password"
            value={waifuPicsApiKey}
            onChange={(e) => setWaifuPicsApiKey(e.target.value)}
            placeholder="Enter Waifu Pics API Key"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nekos-best-key">Nekos.best API Key</Label>
          <Input
            id="nekos-best-key"
            type="password"
            value={nekosBestApiKey}
            onChange={(e) => setNekosBestApiKey(e.target.value)}
            placeholder="Enter Nekos.best API Key"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleLogin}>Login</Button>
      </CardFooter>
    </Card>
  )
}
