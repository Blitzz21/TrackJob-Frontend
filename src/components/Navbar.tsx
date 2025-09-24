import Logo from '../assets/logo/TrackJob.png';

function Navbar() {
  return (
      <div className='w-screen p-4 md:px-16 lg:px-24 xl:px-32 bg-white text-white flex justify-between items-center border-b border-b-[#0000001a]'>
        <a className='flex items-center gap-1' href='#'>
            <img className='w-8 md:w-12 lg:w-14' src={Logo} width={64} height={64} alt="TrackJob Logo" />
            <h1 className='text-[#111827] font-bold text-base md:text-lg lg:text-xl xl:text-2xl'>TrackJob</h1>
        </a>
        <div className='flex items-center gap-2 md:gap-4 lg:gap-6 text-sm md:text-base lg:text-lg xl:text-xl'>
            <a className='text-[#000000a1] hover:underline' href="#">Sign In</a>
            <a className='text-white bg-[#111827] px-1 py-3 rounded-2xl hover:bg-[#090e18] transition-colors duration-150 ease-in-out' href="#">Get Started</a>
        </div>
    </div>
  )
}

export default Navbar;
