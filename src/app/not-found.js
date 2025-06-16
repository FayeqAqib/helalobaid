import Image from 'next/image'
import Link from 'next/link'
// import notFoundImage from 'public/404.jpg'
 
export default function NotFound() {
  return (
    <div className='relative w-full h-[95vh]'>
     <Image
       src="/404.jpg"
       alt="Not Found"
       fill
       className='absolute inset-0 w-full h-full object-cover z-50'
       priority
     />
      <Link href="/">Return Home</Link>
    </div>
  )
}