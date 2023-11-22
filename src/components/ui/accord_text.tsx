import Accordion from 'react-bootstrap/Accordion';
import AccordItem from './accord_item';

interface Props {
  children?: React.ReactNode
  active?: boolean;
  icon?: JSX.Element;
  title: string;
  data: {
    text?: string;
    count: number;
    star?: number;
  }[];
  _border?: boolean;
  setFilterCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function Accord(props: Props) {
  const { children, active, icon, title, data, _border, setFilterCount } = props;
  return (
    <Accordion defaultActiveKey={['1']} alwaysOpen className={icon ? "mb-0" : "mb-6"}>
      <Accordion.Item eventKey={active ? "1": "0"} className={ _border ? "border-none": ""}>
        <Accordion.Header className=''>
          {icon ? 
          <div className="flex gap-x-2 items-center text-black">
            {icon}
            <p className="text-sm capitalize font-medium">{title}</p>
          </div>
            : 
          <p className="text-lg uppercase font-medium">{title}</p>
          }
        </Accordion.Header>
        <Accordion.Body >
          {children ? children : ""}
          {
            data && data.map((dt, idx) => {
              return (
                <AccordItem 
                  key={idx} 
                  text={dt.text} 
                  count={dt.count} 
                  star={dt.star} 
                  setFilterCount={setFilterCount}
                />
              )
            })
          }
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
