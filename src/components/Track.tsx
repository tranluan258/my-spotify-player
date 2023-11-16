import { FC } from 'react';

export interface ITrack {
  id?: string;
  track: {
    id: string;
    name: string;
  };
}

interface TrackProps {
  item: ITrack;
  isActive: boolean;
}

export const Track: FC<TrackProps> = (props) => {
  return (
    <div key={props.item.track.id}>
      {props.isActive ? (
        <div className='text-red-200 track-item-details'>
          <h2>{props.item.track.name}</h2>
        </div>
      ) : (
        <div className='text-white track-item-details'>
          <h2>{props.item.track.name}</h2>
        </div>
      )}
    </div>
  );
};
