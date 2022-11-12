import Menu from "./Menu";
import {render, screen } from '@testing-library/react';

describe('Menu', () => {
    it("should render correctly", () => {
        render(<Menu/>);
        screen.getByText("아침");
        screen.getByText("점심");
        screen.getByText("저녁");
        screen.getByText("학생회관");
        screen.getByText("아워홈");
        screen.getByText("기숙사식당");
        screen.getByText("301동식당");
        screen.getByText("제육볶음 3000");
        screen.getByText("야채탕&청포묵김가루무침 3000");
        screen.getByText("제육숙주볶음 4500");
        screen.getByText("닭개장 5500");
    });       
});