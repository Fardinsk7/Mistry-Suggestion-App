import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const suggestions = [
      "What's something you've always wanted to try but haven't yet?",
      "If you could have any superpower, what would it be?",
      "What's the most interesting thing you've learned this week?",
      "What's your guilty pleasure?",
      "If you could live anywhere in the world, where would it be?",
      "What's your favorite way to relax after a long day?",
      "What's a hobby you've always wanted to pick up?",
      "What motivates you to keep going, even on tough days?",
      "What's the best advice you've ever received?",
      "If you could meet any historical figure, who would it be?",
      "What's your biggest pet peeve?",
      "What's the most spontaneous thing you've ever done?",
      "If you could switch lives with someone for a day, who would it be?",
      "What's your favorite memory from childhood?",
      "What's the most challenging thing you've ever done?",
      "If you could master any skill instantly, what would it be?",
      "What's your favorite book or movie?",
      "What's a fear you've overcome?",
      "If you had unlimited resources, what would you do?",
      "What's the most rewarding thing about your current job or study?",
      "What's your favorite way to spend a weekend?",
      "If you could change one thing about the world, what would it be?",
      "What's something you're really proud of?",
      "What's a goal you're currently working towards?",
      "What's your favorite way to stay healthy?",
      "If you could relive any moment in your life, what would it be?",
      "What's your favorite thing about yourself?",
      "What's the most important lesson life has taught you?",
      "What's a dream you've never told anyone?",
      "If you could invent anything, what would it be?",
      "What's something you wish you knew earlier?",
      "What's your favorite way to help others?",
      "If you could time travel, where would you go?",
      "What's something you've always been curious about?",
      "What's your favorite way to unwind?",
      "What's the most interesting place you've ever visited?",
      "If you could be famous for one thing, what would it be?",
      "What's the best compliment you've ever received?",
      "What's a challenge you're currently facing?",
      "If you could solve any mystery, what would it be?",
      "What's something you'd like to learn more about?",
      "What's your favorite type of music or artist?",
      "If you could create your perfect day, what would it look like?",
      "What's something that always makes you smile?",
      "What's the most adventurous thing you've ever done?",
      "If you could only eat one food for the rest of your life, what would it be?",
      "What's something you're passionate about?",
      "If you could spend a day with anyone, living or dead, who would it be?",
      "What's the most valuable lesson you've learned from a mistake?",
      "If you could have dinner with any celebrity, who would it be?",
      "What's your favorite way to express yourself creatively?",
      "What's something you've done that you're really proud of?",
      "If you could travel anywhere, where would you go?",
      "What's a cause that's close to your heart?",
      "What's the best thing about your personality?",
      "If you could change one thing about your past, what would it be?",
      "What's your favorite way to challenge yourself?",
      "What's something you'd like to be remembered for?",
      "If you could write a book, what would it be about?",
      "What's your favorite way to relax?",
      "What's something you wish more people knew about you?",
      "If you could have any job in the world, what would it be?",
      "What's the most surprising thing you've learned about yourself?",
      "What's your favorite quote or motto?",
      "If you could learn any language, what would it be?",
      "What's your biggest dream for the future?",
      "What's the most beautiful place you've ever seen?",
      "If you could live in any time period, when would it be?",
      "What's something that always inspires you?",
      "If you could make one wish come true, what would it be?",
      "What's the most interesting conversation you've had recently?",
      "What's your favorite way to connect with others?",
      "If you could have any animal as a pet, what would it be?",
      "What's something that never fails to cheer you up?",
      "What's the most important quality in a friend?",
      "If you could have one talent you don't currently possess, what would it be?",
      "What's your favorite way to spend time alone?",
      "What's a skill you've been meaning to learn?",
      "If you could change one law, what would it be?",
      "What's your favorite way to show kindness?",
      "What's something you're grateful for today?",
      "If you could be any character from a book or movie, who would it be?",
      "What's something that challenges your perspective?",
      "What's your favorite way to celebrate success?",
      "If you could create your dream home, what would it look like?",
      "What's something that makes you feel fulfilled?",
      "What's the best gift you've ever received?",
      "If you could visit any fictional world, where would you go?",
      "What's your favorite way to stay motivated?",
      "What's something that always brings you peace?",
      "If you could see any band or artist, living or dead, in concert, who would it be?",
      "What's something you're curious about right now?",
      "What's your favorite way to stay active?",
      "If you could be an expert in any field, what would it be?",
      "What's something you've always wanted to create?",
      "What's your favorite way to enjoy nature?",
      "If you could have any piece of art in the world, what would it be?",
      "What's something you want to explore more deeply?",
      "What's your favorite way to spend time with loved ones?",
      "If you could change the world in one way, what would it be?",
      "What's the most memorable experience of your life?"
    ];
    const newArr = []
    for(let i = 0;i<=5;i++){
      const a = Math.floor(Math.random()*90)+10
      newArr.push(suggestions[a])
    }
    return Response.json({
      success:true,
      message:newArr
    },{status:200})
    
  } catch (error) {
    console.log("Error giving suggestion: ",error);
    return Response.json({
      success:false,
      message:"Error in giving suggestion"
    },{status:500})
  }
}