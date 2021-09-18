
import MUISlider from '@mui/material/Slider';
import styled from 'styled-components';

interface SliderProps {
    value: number
    onChange: (event: Event, value: any) => void
    range: number[]
    icon?: JSX.Element
}

const Slider = (props: SliderProps) => {
    const { value, onChange, range, icon } = props
    return <SliderWrapper>
        {icon}
        <MUISlider
            value={value}
            onChange={onChange}
            min={range[0]}
            max={range[1]}
            valueLabelDisplay="on"
        />
    </SliderWrapper>
}

export default Slider

const SliderWrapper = styled.div`
    display:flex;
    flex-direction: row;
    width: 100%;
`