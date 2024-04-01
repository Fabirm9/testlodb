import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column('text', {
        unique:true
    })
    email:string;
    
    @Column({type:'text', select:false})
    password:string;

    @Column({type:'text'})
    fullName:string;
    
    @Column({type:'bool', default:1})
    isActive:boolean;
    
    @Column({
        type:'text',
        array:true,
        default:['user']
    })
    roles:string[];


    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product

}
