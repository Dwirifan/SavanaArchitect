import { PrismaClient } from "@prisma/client";
import { DEFAULT_PROJECTS, DEFAULT_JOURNAL, DEFAULT_TEAM, DEFAULT_PRODUCTS, DEFAULT_STUDIO } from "../lib/cms.defaults";
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.savanaProject.count();
  if (c > 0) { console.log("Seed skipped: already has data"); return; }
  console.log("Seeding Savana CMS...");
  for (let i=0;i<DEFAULT_PROJECTS.length;i++){const p=DEFAULT_PROJECTS[i];await prisma.savanaProject.create({data:{id:p.id,title:p.title,location:p.location,year:p.year,category:p.category,cover:p.cover,images:p.images,videos:(p as any).videos??[],excerpt:p.excerpt,area:(p as any).area??null,status:p.status,order:i}})}
  for (let i=0;i<DEFAULT_JOURNAL.length;i++){const j=DEFAULT_JOURNAL[i];await prisma.savanaJournal.create({data:{id:j.id,title:j.title,date:j.date,tag:j.tag,image:j.image,excerpt:j.excerpt,order:i}})}
  for (let i=0;i<DEFAULT_TEAM.length;i++){const t=DEFAULT_TEAM[i];await prisma.savanaTeam.create({data:{id:t.id,name:t.name,role:t.role,bio:t.bio,image:t.image,order:i}})}
  for (let i=0;i<DEFAULT_PRODUCTS.length;i++){const p=DEFAULT_PRODUCTS[i];await prisma.savanaProduct.create({data:{id:p.id,name:p.name,category:p.category,price:p.price,material:p.material,dimensions:p.dimensions,image:p.image,images:(p as any).images??[],excerpt:p.excerpt,inStock:p.inStock,order:i}})}
  await prisma.savanaStudio.upsert({where:{id:"studio"},create:{id:"studio",heroTitle:DEFAULT_STUDIO.heroTitle,heroSubtitle:DEFAULT_STUDIO.heroSubtitle,studioHeadline:DEFAULT_STUDIO.studioHeadline,studioHeadlineAccent:DEFAULT_STUDIO.studioHeadlineAccent,studioHeadlineTail:DEFAULT_STUDIO.studioHeadlineTail,quote:DEFAULT_STUDIO.quote,about:DEFAULT_STUDIO.about,philosophy:DEFAULT_STUDIO.philosophy,contactHeadline:(DEFAULT_STUDIO as any).contactHeadline??null,contactHeadlineAccent:(DEFAULT_STUDIO as any).contactHeadlineAccent??null,email:DEFAULT_STUDIO.email,phone:DEFAULT_STUDIO.phone,address:DEFAULT_STUDIO.address,instagram:DEFAULT_STUDIO.instagram},update:{}})
  console.log("Seed done");
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
