import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden'>
        <Menu/>
      </SheetTrigger>
      <SheetContent side="left" className='w-[300]' >
        {/* TODO: Chatroom list 구현 */}
        <div>Chatroom List</div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar