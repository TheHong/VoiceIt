
import MUISlider from '@mui/material/Slider';
import styled from 'styled-components';

interface SliderProps {
    value: number
    onChange: (event: Event, value: any) => void
    range: number[]
    icon?: JSX.Element
    prefix?: string
    restrictedVals?: number[]
}

const Slider = (props: SliderProps) => {
    const { value, onChange, range, icon, prefix = '', restrictedVals } = props
    return <SliderWrapper>
        <div style={{ marginRight: "50px" }}>
            {icon}
        </div>
        <MUISlider
            value={value}
            onChange={onChange}
            min={range[0]}
            max={range[1]}
            valueLabelDisplay="on"
            valueLabelFormat={value => `${value}${prefix}`}
            step={!!restrictedVals ? null : undefined}
            marks={restrictedVals?.map((val: number) => ({ value: val, label: val.toString() }))}
        />
    </SliderWrapper>
}

export default Slider

const SliderWrapper = styled.div`
    display:flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`