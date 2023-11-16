export interface IPlaylist {
  id: string;
  name: string;
  images: Array<{
    url: string;
  }>;
}

interface IProps {
  item: IPlaylist;
  selectPlaylist: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Playlist = (props: IProps) => {
  return (
    <div
      className='flex flex-row h-3/4 justify-between items-center w-72 px-2 mr-2 bg-gray-600 rounded-md hover:bg-gray-700 '
      key={props.item.id}
      onClick={props.selectPlaylist}
      id={props.item.id}
    >
      <div className='flex flex-row items-center'>
        <img
          src={props.item.images[0].url}
          alt={props.item.name}
          id={props.item.id}
          className='w-12 h-12 rounded-full '
        />
        <div>
          <h2
            id={props.item.id}
            className='items-center mx-5 text-white border-b-2 border-transparent'
          >
            {props.item.name}
          </h2>
        </div>
      </div>
      <div className=''>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6 text-green-200 '
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z'
          />
        </svg>
      </div>
    </div>
  );
};
