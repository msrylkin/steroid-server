'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // console.log(queryInterface)
    return queryInterface.sequelize.query(`
    create table public.releases
    (
        id          serial
            primary key,
        commit      varchar                                            not null,
        status      varchar                                            not null,
        "createdAt" timestamp with time zone default CURRENT_TIMESTAMP not null,
        "updatedAt" timestamp with time zone default CURRENT_TIMESTAMP not null,
        "uploadId"  varchar
    );
    
    alter table public.releases
        owner to "user";
    
    create table public.trackers
    (
        id          serial
            primary key,
        name        varchar not null,
        "createdAt" timestamp with time zone default CURRENT_TIMESTAMP,
        "updatedAt" timestamp with time zone default CURRENT_TIMESTAMP
    );
    
    alter table public.trackers
        owner to "user";
    
    create table public."codePlace"
    (
        id              serial
            primary key,
        "fileName"      varchar                                            not null,
        "startColumn"   integer                                            not null,
        "endColumn"     integer                                            not null,
        "startLine"     integer                                            not null,
        "endLine"       integer                                            not null,
        status          varchar                                            not null,
        type            "codePlaceType"                                    not null,
        "releaseId"     integer                                            not null
            references public.releases,
        "trackerId"     integer                                            not null
            references public.trackers,
        "createdAt"     timestamp with time zone default CURRENT_TIMESTAMP not null,
        "updatedAt"     timestamp with time zone default CURRENT_TIMESTAMP not null,
        "executionTime" integer                  default 0                 not null,
        "hitCount"      integer                  default 0                 not null
    );
    
    alter table public."codePlace"
        owner to "user";
    
    create unique index "idx__codePlace__releaseId_fileName_startColumn_startLine"
        on public."codePlace" ("fileName", "startColumn", "startLine", "releaseId");
    
    create table public.measurements
    (
        id              serial
            primary key,
        "releaseId"     integer not null
            references public.releases,
        "trackerId"     integer not null
            references public.trackers,
        "executionTime" integer                  default 0,
        "createdAt"     timestamp with time zone default CURRENT_TIMESTAMP,
        "updatedAt"     timestamp with time zone default CURRENT_TIMESTAMP
    );
    
    alter table public.measurements
        owner to "user";
    
    create table public.files
    (
        id            serial
            primary key,
        content       text                                               not null,
        "codePlaceId" integer
            references public."codePlace",
        "releaseId"   integer
            references public.releases,
        "createdAt"   timestamp with time zone default CURRENT_TIMESTAMP not null,
        "updatedAt"   timestamp with time zone default CURRENT_TIMESTAMP not null,
        path          varchar
    );
    
    alter table public.files
        owner to "user";
    
    
    `);
  },

  down: async (queryInterface, Sequelize) => {
    return null;
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
