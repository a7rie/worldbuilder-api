# Worldbuilder

This is a project I've built to gain a better understanding of SQL and ORMs. It's a full-stack application that allows users to create and populate fictional worlds, and create several types of relationships between entities in the world. The primary motivation is that worldbuilding is complex; lots of different interrelated data needs to be organized in a way that's easy to track. Existing solutions don't offer that much in terms of relationships between different entities in the world. 

The Worldbuilder allows users to create these entities (see `schema.sql`):
- Worlds 
- Events
- Characters
- Items
- Locations
- Groups (of characters)

These types of relationships can exist between entities:
- 1:M relationship between worlds and... everything else.
- M:M relationship between characters and events.
- M:M relationship between groups and characters.
- M:M relationship between characters themselves ("relationships", as in, what is the association between character A and character B?)
- M:M relationship between characters and items (an item can be "owned" by mulitple characters)


This is a fairly simple PoC; I've hosted a live version here for anyone interested: https://worldbuilder.aminelnasri.com/. Do not store sensitive or volatile data.

See the `worldbuilder-client` repository on my account for the front-end code.



## Some Screenshots
![Alt text](./readme/world_overview.png?raw=true)
![Alt text](./readme/char_overview.png?raw=true)
![Alt text](./readme/char_overview_2.png?raw=true)
![Alt text](./readme/edit_character.png?raw=true)
![Alt text](./readme/event_overview.png?raw=true)
![Alt text](./readme/location_overview.png?raw=true)