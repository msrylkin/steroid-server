import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection } from "typeorm";

@Entity({ name: 'users' })
export class TypeormUser {

    @PrimaryGeneratedColumn()
    id!: number;
}