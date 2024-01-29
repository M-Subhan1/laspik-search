export default function HelpPage() {
  return (
    <div className='flex h-full items-center justify-center container p-5'>
      <iframe
        className='w-4/5 aspect-video'
        src='https://www.youtube.com/embed/OXk6Eabu7uM?si=1Nq7j6nNewC0OJ7h'
        title='YouTube video player'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
      ></iframe>
    </div>
  );
}
