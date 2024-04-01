import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {
    
    @ApiProperty({
        example: '294700bd-771d-4f5e-8ae5-93db32b3544a',
        description: 'Product Id',
        uniqueItems: true})
    @PrimaryGeneratedColumn('uuid')
    id:string;
    

    @ApiProperty({
        example: 'T-Shit teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique:true
    })
    title:string;
    
    @ApiProperty({
        example: 15.99,
        description: 'Product price',
        uniqueItems: false
    })
    @Column('float', {
        default:0
    })
    price:number;

    @ApiProperty({
        example: 'fjsajjdfksjf ',
        description: 'Product description',
        default: null
    })
    @Column({
        type:'text',
        nullable:true
    })
    description:string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG- for seo',
        uniqueItems: true
    })
    @Column({
        type:'text',
        unique:true
    })
    slug:string;
    
    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column({
        type: 'int',
        default:0
    
    })
    stock:number
    
    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product sizes'
    })
    @Column({
        type:'text',
        array:true
    })
    sizes: string[]
    
    @ApiProperty({
        example: 'women ',
        description: 'Product gender',
    })
    @Column({
        type:'text'
    })
    gender:string;
    
    @ApiProperty({
        
    })
    @Column({
        type:'text',
        array:true,
        default:[]
    })
    tags:string[];

    
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade : true , eager:true}
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager: true }
    )
    user: User

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title
          }
        
          this.slug = this.slug
              .toLowerCase()
              .replaceAll(' ', '_')
              .replaceAll("'",'');
          
    }

    @BeforeUpdate()
    checkSlugUpdate(){        
          this.slug = this.slug
              .toLowerCase()
              .replaceAll(' ', '_')
              .replaceAll("'",'');
    }

}
