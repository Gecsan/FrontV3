import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Change this line to export as default
export default function QuoteCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Get a quote</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="origin">Origin</Label>
              <Input id="origin" placeholder="Enter origin zip code" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" placeholder="Enter destination zip code" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="moveSize">Move Size</Label>
              <Select>
                <SelectTrigger id="moveSize">
                  <SelectValue placeholder="Select move size" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1bedroom">1 Bedroom</SelectItem>
                  <SelectItem value="2bedroom">2 Bedrooms</SelectItem>
                  <SelectItem value="3bedroom">3+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="moveDate">Move Date</Label>
              <Input id="moveDate" type="date" />
            </div>
            <Button type="submit">Get Quote</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

