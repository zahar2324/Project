import { IsNumber, IsString, Max, MAX, Min, MIN } from "class-validator";


export class ReviewDto  {
    @IsNumber()
    @Min(1)
    @Max(5)

    rating:number
    @IsString()
    text: string
}